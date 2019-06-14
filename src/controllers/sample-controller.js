/* eslint-disable */

const db = require('../app/db');

//checks if object is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

module.exports = {

  async checkin(ctx) {
    var start = new Date();
    var year = start.getFullYear();
    var month = start.getMonth() + 1;
    var day = start.getDate();
    var hours = start.getHours();
    var minutes = start.getMinutes();
    var cdate = `${year}-${month}-${day}`;
    var ctime = `${hours}:${minutes}`;
    var q = ctx.request.querystring;

    console.log(`${cdate} ${ctime} ${q}`);
    console.log('checking in');

    ctx.body = { status: 'checking in' };

    //test if user's first time checking in
    var test = await db('checkin').where({
      email: q,
      checkdate: cdate,
    }).select();

    //adds row to checkin and prints out table
    if (isEmpty(test)) {
      await db('checkin').insert({
        email: q,
        checkdate: cdate,
        checktime: ctime,
      });

      var x = await db('checkin').select();
      console.log(x);
      console.log('CHECKED IN');

    } else {
      ctx.status = 409;
      ctx.message = "Already Checked In";
      console.log('checkin failed');

    }

  },

  async checkout(ctx) {

    var start = new Date();
    var year = start.getFullYear();
    var month = start.getMonth() + 1;
    var day = start.getDate();
    var hours = start.getHours();
    var minutes = start.getMinutes();
    var cdate = `${year}-${month}-${day}`;
    var ctime = `${hours}:${minutes}`;
    var q = ctx.request.querystring;

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

    } else if (!isEmpty(test2)) {
      ctx.status = 409;
      ctx.message = "Already Checked Out";
      console.log('checkout failed');

      //add row to checkout and prints out table
    } else {
      await db('checkout').insert({
        email: q,
        checkdate: `${year}-${month}-${day}`,
        checktime: `${hours}:${minutes}`,
      });

      var x = await db('checkout').select();

      console.log(x);
      console.log('CHECKED OUT');
    }

  }

};

