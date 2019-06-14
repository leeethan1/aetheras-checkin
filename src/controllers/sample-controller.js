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
    const ctime = `${hours}:${minutes}`

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
      //add row with email, checkdate, checktime
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
      console.log('checkin failed')
    }

  },
  async checkout(ctx) {
    const start = new Date();
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const day = start.getDate();
    const hours = start.getHours();
    const minutes = start.getMinutes();

    console.log(`${year}/${month}/${day} ${hours}:${minutes}`);
    const q = ctx.request.querystring;
    console.log(q);
    console.log('checking out');
    ctx.body = { status: 'checked out' };

    await db('checkout').insert({
      email: q,
      checkdate: `${year}-${month}-${day}`,
      checktime: `${hours}:${minutes}`,
    });

    x = await db('checkout').select();
    console.log(x);
    console.log('CHECKED OUT');
  },


};

