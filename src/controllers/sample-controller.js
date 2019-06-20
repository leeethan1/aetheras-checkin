/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */


const { types } = require('pg');

const db = require('../app/db');

const TYPE_DATESTAMP = 1082;
types.setTypeParser(TYPE_DATESTAMP, date => date);

// checks if object is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function getFDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const minutes = start.getMinutes();
  const fDate = `${year}-${month}-${day}`;
  const fTime = `${hours}:${minutes}`;

  return [fDate, fTime];
}

// backlogs checkout if user forgot the previous day
async function hasCheckedOut(emailaddr) {
  // const start = new Date();
  // var temp = start - 86400000;
  // var prevDate = new Date(temp);
  // const dayNum = prevDate.getDay();
  // // change previous day to Friday if yesterday was Sunday
  // if (dayNum === 0) {
  //   temp = start - 259200000;
  //   prevDate = new Date(temp);
  // }
  // const year = prevDate.getFullYear();
  // const month = prevDate.getMonth() + 1;
  // const day = prevDate.getDate();
  // var fDate = `${year}-${month}-${day}`;
  var uid;

  const test = await db('checkin').select('checkdate').where({
    email: emailaddr,
  }).orderBy('checkdate', 'desc')
    .limit(1);

  const fDate = test[0].checkdate;
  // console.log(test[0].checkdate);

  const checkedin = await db('checkin').select().where({
    email: emailaddr,
    checkdate: fDate,
  });
  if (isEmpty(checkedin)) {
    return;
  }

  const checkedout = await db('checkout').select().where({
    email: emailaddr,
    checkdate: fDate,
  });
  if (isEmpty(checkedout)) {
    uid = await db('employees').where({
      email: emailaddr,
    }).select('id');
    uid = uid[0].id;
    await db('checkout').insert({
      id: uid,
      email: emailaddr,
      checkdate: fDate,
      checkouttime: '18:00',
    });

    // print inserted row
    const x = await db('checkout').select().where({
      email: emailaddr,
      checkdate: fDate,
    });
    console.log(x);
    console.log('^^^ADDED BACKLOG^^^\n');
  }
}

async function checkIP(check, emailaddr, ipaddr) {
  const eip = await db('employees').select('ip').where({ email: emailaddr });

  if (eip[0].ip === ipaddr) {
    return true;
  }
  if (eip[0].ip === null) {
    await db('employees').update({ ip: ipaddr }).where({ email: emailaddr });

    console.log(await db('employees').select().where({ email: emailaddr }));
    console.log('^^^UPDATED EMPLOYEE IP^^^\n');
    return true;
  }

  // const ips = await db(check).select('ip').where({ email: emailaddr })
  //   .groupBy('ip')
  //   .orderByRaw('count(ip) DESC LIMIT 1');
  // await db('employees').update({ ip: ips[0].ip }).where({ email: emailaddr });

  // if (ips[0].ip === ipaddr) {
  //   return true;
  // }
  return false;
}

module.exports = {

  async checkin(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    const emailaddr = ctx.request.body.email;
    const ipaddr = ctx.ip;

    console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('+++CHECKING IN+++\n');

    // checks whether email exists in database
    var ref = await db('employees').where({
      email: emailaddr,
    }).select();

    if (isEmpty(ref)) {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    const ipcheck = await checkIP('checkin', emailaddr, ipaddr);
    if (!ipcheck) {
      console.log('*****IRREGULAR IP ADDRESS*****');
      ctx.status = 409;
      ctx.message = 'Irregular IP address';
      return;
    }

    // checks whether user has already checked in today
    var checkins = await db('checkin').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();

    if (!isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'Already Checked In';

      console.log('*****ALREADY CHECKED IN*****');
    } else {
      await hasCheckedOut(emailaddr);
      // add row to checkin table
      await db('checkin').insert({
        email: emailaddr,
        checkdate: fDate,
        checkintime: fTime,
        ip: ipaddr,
      });
      ctx.status = 200;

      // print out checkin table
      const x = await db('checkin').select().where({
        email: emailaddr,
        checkdate: fDate,
      });
      console.log(x);
      console.log('+++CHECKED IN+++');
    }
  },

  async checkout(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    const emailaddr = ctx.request.body.email;
    const ipaddr = ctx.ip;

    console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('+++CHECKING OUT+++\n');

    // checks whether email exists in database
    var ref = await db('employees').where({
      email: emailaddr,
    }).select();

    if (!isEmpty(ref)) {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    const ipcheck = await checkIP('checkout', emailaddr, ipaddr);
    if (!ipcheck) {
      console.log('*****IRREGULAR IP ADDRESS*****');
      ctx.status = 409;
      ctx.message = 'Irregular IP address';
      return;
    }

    // checks whether user has checked in or checked out today
    var checkins = await db('checkin').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();
    var checkouts = await db('checkout').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();

    if (isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'You have not checked in yet';

      console.log('*****CHECKOUT FAILED: ALREADY CHECKED OUT*****');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out';

      console.log('*****CHECKOUT FAILED: ALREADY CHECKED IN*****');
    } else {
      await db('checkout').insert({
        // add row to checkout table
        email: emailaddr,
        checkdate: fDate,
        checkouttime: fTime,
        ip: ipaddr,
      });
      ctx.status = 200;

      // prints out checkout table
      const x = await db('checkout').select().where({
        email: emailaddr,
        checkdate: fDate,
      });
      console.log(x);
      console.log('+++CHECKED OUT+++');
    }
  },

  async addemail(ctx) {
    ctx.body = 'Adding email';
    const query = ctx.request.body;
    const emailadr = query.email;
    const fname = query.firstname;
    const lname = query.lastname;

    // checks if email is already added to the registry
    try {
      await db('employees').insert({
        email: emailadr,
        firstname: fname,
        lastname: lname,
      });
      ctx.status = 200;

      var x = await db('employees').select();
      console.log(x);
      console.log('ADDED');
    } catch (err) {
      throw err;
    }
  },

  async employees(ctx) {
    ctx.body = 'Viewing employees';
    var x = await db('employees').select('email');
    x = JSON.stringify(x);
    ctx.message = x;
  },

  // creates combined checkin/checkout json
  async userlogs(ctx) {
    const emailaddr = ctx.request.body.email;

    const table = await db('checkin').select()
      .innerJoin('checkout', function () {
        this.onIn('checkin.email', [emailaddr])
          .onIn('checkout.email', [emailaddr])
          .on('checkin.checkdate', '=', 'checkout.checkdate');
      })
      .innerJoin('employees', 'employees.id', 'checkin.id');

    ctx.response.body = table;
  },

};
