/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */

const db = require('../app/db');

// ONLY FOR TESTING
async function testvalues() {
  await db('employees').insert([
    { id: 1, email: 'a@a.com', ip: 'test' },
    { id: 2, email: 'b@b.com' },
    { id: 3, email: 'c@c.com' },
  ]);
}

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
testvalues();
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
      uid = db('employees').where({
        email: emailaddr,
      }).select('id');
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('EMAIL DOES NOT EXIST+++++++++++');

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

      console.log('CHECKIN FAILED');
    } else {
      // add row to checkin table
      await db('checkin').insert({
        id: uid,
        email: emailaddr,
        checkdate: fDate,
        checktime: fTime,
        ip: ipaddr,
      });
      ctx.status = 200;

      // print out checkin table
      var x = await db('checkin').select();
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
      uid = db('employees').where({
        email: emailaddr,
      }).select('id');
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

      console.log('CHECKOUT FAILED1');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out';

      console.log('CHECKOUT FAILED2');
    } else {
      await db('checkout').insert({
        // add row to checkout table
        id: uid,
        email: emailaddr,
        checkdate: fDate,
        checktime: fTime,
        ip: ipaddr,
      });
      ctx.status = 200;

      // prints out checkout table
      var x = await db('checkout').select();
      console.log(x);
      console.log('CHECKED OUT');
    }
  },

  async employees(ctx) {
    ctx.body = await db('employees').select();
  },

};
