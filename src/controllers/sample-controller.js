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
  const start = new Date();
  var temp = start - 86400000;
  var prevDate = new Date(temp);
  const dayNum = prevDate.getDay();
  // change previous day to Friday if yesterday was Sunday
  if (dayNum === 0) {
    temp = start - 259200000;
    prevDate = new Date(temp);
  }
  const year = prevDate.getFullYear();
  const month = prevDate.getMonth() + 1;
  const day = prevDate.getDate();
  const fDate = `${year}-${month}-${day}`;
  var uid;

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
      checkouttime: '20:00',
    });

    // print inserted row
    const x = await db('checkout').select().where({
      email: emailaddr,
      checkdate: fDate,
    });
    console.log(x);
    console.log('ADDED BACKLOG');
  }
}

module.exports = {

  async checkin(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    const emailaddr = ctx.request.body.email;
    const ipaddr = ctx.ip;
    var uid;

    console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('checking in');

    // checks whether email exists in database
    var ref = await db('employees').where({
      email: emailaddr,
    }).select();

    if (!isEmpty(ref)) {
      uid = await db('employees').where({
        email: emailaddr,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('EMAIL DOES NOT EXIST+++++++++++');

      return;
    }

    await hasCheckedOut(emailaddr);

    // checks whether user has already checked in today
    var checkins = await db('checkin').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();

    if (!isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'Already Checked In';

      console.log('CHECKIN FAILED');
    } else {
      // add row to checkin table
      await db('checkin').insert({
        id: uid,
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
      console.log('CHECKED IN');
    }
  },

  async checkout(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    const emailaddr = ctx.request.body.email;
    const ipaddr = ctx.ip;
    var uid;

    console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('checking out');

    // checks whether email exists in database
    var ref = await db('employees').where({
      email: emailaddr,
    }).select();

    if (!isEmpty(ref)) {
      uid = await db('employees').where({
        email: emailaddr,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('EMAIL DOES NOT EXIST+++++++++++');

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

      console.log('CHECKOUT FAILED: ALREADY CHECKED OUT');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out';

      console.log('CHECKOUT FAILED: ALREADY CHECKED IN');
    } else {
      await db('checkout').insert({
        // add row to checkout table
        id: uid,
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
      console.log('CHECKED OUT');
    }
  },

  async addemail(ctx) {
    ctx.body = 'Adding email';
    const query = ctx.request.querystring.split('&');
    const emailaddr = query[0];
    const fname = query[1];
    const lname = query[2];

    // checks if email is already added to the registry
    try {
      await db('employees').insert({
        email: emailaddr,
        firstname: fname,
        lastname: lname,
      });
      ctx.status = 200;

      var x = await db('checkin').select();
      console.log(x);
      console.log('ADDED');
    } catch (err) {
      ctx.status = 409;
      ctx.message = err;
      throw err;
    }
  },

  async employees(ctx) {
    ctx.body = await db('employees').select();
  },

  // creates combined checkin/checkout json
  async userlogs(ctx) {
    const emailaddr = ctx.request.body.email;

    const table = await db('checkin').select()
      .innerJoin('checkout', function () {
        this.onIn('checkin.email', [emailaddr])
          .onIn('checkout.email', [emailaddr])
          .on('checkin.checkdate', '=', 'checkout.checkdate');
      });

    console.log(table);
    ctx.response.body = table;
  },

};
