/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */

const db = require('../app/db');

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
  const fdate = `${year}-${month}-${day}`;
  const ftime = `${hours}:${minutes}`;

  return [fdate, ftime];
}

module.exports = {

  async checkin(ctx) {
    const date = getFDateTime();
    const fdate = date[0];
    const ftime = date[1];
    const emailadr = ctx.request.querystring;
    var uid;

    console.log(`${fdate} ${ftime} ${emailadr}`);
    console.log('checking in');

    ctx.body = { status: 'checking in' };

    var ref = await db('employees').where({
      email: emailadr,
    }).select();

    if (!isEmpty(ref)) {
      uid = db('employees').where({
        email: emailadr,
      }).select('id');
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('EMAIL DOES NOT EXIST+++++++++++');

      return;
    }

    var checkins = await db('checkin').where({
      email: emailadr,
      checkdate: fdate,
    }).select();

    if (!isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'Already Checked In';

      console.log('CHECKIN FAILED');
    } else {
      // add row to checkin table
      await db('checkin').insert({
        id: uid,
        email: emailadr,
        checkdate: fdate,
        checktime: ftime,
      });
      // print out checkin table
      var x = await db('checkin').select();
      console.log(x);
      console.log('CHECKED IN');
    }
  },

  async checkout(ctx) {
    const date = getFDateTime();
    const fdate = date[0];
    const ftime = date[1];
    const emailadr = ctx.request.querystring;
    var uid;

    console.log(`${fdate} ${ftime} ${emailadr}`);
    console.log('checking out');

    ctx.body = { status: 'checking out' };

    var ref = await db('employees').where({
      email: emailadr,
    }).select();

    if (!isEmpty(ref)) {
      uid = db('employees').where({
        email: emailadr,
      }).select('id');
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('EMAIL DOES NOT EXIST+++++++++++');

      return;
    }

    // tests that user has checked in today and is first time checking out
    var checkins = await db('checkin').where({
      email: emailadr,
      checkdate: fdate,
    }).select();
    var checkouts = await db('checkout').where({
      email: emailadr,
      checkdate: fdate,
    }).select();

    if (isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'You have not checked in yet';

      console.log('CHECKOUT FAILED1');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out';

      console.log('CHECKOUT FAILED2');
    } else {
      await db('checkout').insert({
        id: uid,
        email: emailadr,
        checkdate: fdate,
        checktime: ftime,
      });

      // prints out checkout table
      var x = await db('checkout').select();
      console.log(x);
      console.log('CHECKED OUT');
    }
  },

};
