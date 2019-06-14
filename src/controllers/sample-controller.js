/* eslint-disable */

const db = require('../app/db');

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

module.exports = {

  async checkin(ctx) {
    const start = new Date();
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const day = start.getDate();
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const cdate = `${year}-${month}-${day}`;
    const ctime = `${hours}:${minutes}`;

    const q = ctx.request.querystring;
    console.log(`${cdate} ${ctime} ${q}`);
    console.log('checking in');

    ctx.body = { status: 'checking in' };

    //test if user's first time checking in
    var test = await db('checkin').where({
      email: q,
      checkdate: cdate,
    }).select();

    if (isEmpty(test)) {
      //add row to checkin table
      await db('checkin').insert({
        email: q,
        checkdate: cdate,
        checktime: ctime,
      });
      //print out checkin table
      x = await db('checkin').select();
      console.log(x);
      console.log('CHECKED IN');
    } else {
      ctx.status = 409;
      ctx.message = "Already Checked In";
      console.log('checkin failed');
    }

  },

  async checkout(ctx) {

    const start = new Date();
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const day = start.getDate();
    const hours = start.getHours();
    const minutes = start.getMinutes();
    const cdate = `${year}-${month}-${day}`;
    const ctime = `${hours}:${minutes}`;

    const q = ctx.request.querystring;
    console.log(`${cdate} ${ctime} ${q}`);
    console.log('checking out');

    ctx.body = { status: 'checking out' };

    //tests that user has checked in today and is first time checking out
    var test1 = await db('checkin').where({
      email: q,
      checkdate: cdate,
    }).select();

    var test2 = await db('checkout').where({
      email: q,
      checkdate: cdate,
    }).select();

    if (isEmpty(test1)) {
      ctx.status = 409;
      ctx.message = "You have not checked in yet";
    }
    else if (!isEmpty(test2)) {
      //add row to checkout table 
      ctx.status = 409;
      ctx.message = "Already Checked Out";
      console.log('checkout failed');
    } 
    else {
      await db('checkout').insert({
        email: q,
        checkdate: `${year}-${month}-${day}`,
        checktime: `${hours}:${minutes}`,
      });

      //prints out checkout table
      x = await db('checkout').select();

      console.log(x);
      console.log('CHECKED OUT');
    }
  }

};

