/* eslint-disable */

const db = require('../app/db');


// let i = 0;
// const cookieDelete = function (ctx) {
//   ctx.cookies.set('name', '', { httpOnly: false });
// };
module.exports = {

  async checkin(ctx) {
    const start = new Date();
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const day = start.getDate();
    const hours = start.getHours();
    const minutes = start.getMinutes();

    console.log(`${year}/${month}/${day} ${hours}:${minutes}`);
    const q = ctx.request.querystring;
    console.log(q);
    console.log('checking in');
    ctx.body = { status: 'checked in' };
    var checkinperson = [{
      email: q,
      checkdate: `${year}-${month}-${day}`,
      checkintime: `${hours}:${minutes}`,
      checkouttime: null,
    }];

    await db('checkin').insert(checkinperson);
    x = await db('checkin').select();
    console.log(x);
    console.log('CHECKED IN');

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

    await db('checkin').insert({
      email: q,
      checkdate: `${year}-${month}-${day}`,
      checkouttime: `${hours}:${minutes}`,
    });
    x = await db('checkin').select();
    console.log(x);
    console.log('CHECKED OUT');


  },


};

// async hello(ctx) {
//   ctx.body = { resp: 'hello' };
//   ctx.redirect('./sample2');
//   ctx.cookies.set('name', 'ethan', { httpOnly: false });
// },
// async byebye(ctx) {
//   ctx.body = {
//     resp: 'bye',
//     name: ctx.cookies.get('name'),
//   };
//   ctx.body.redirected = ctx.cookies.get('name') ? 'yes' : 'no';
//   // console.log(ctx.status);
//   cookieDelete(ctx);
// },
// async tests(ctx) {
//   ctx.append('hello', 'header');
//   ctx.body = { data: 'blah' };
//   // ctx.querystring = { next: '0' };
//   // ctx.query = { next: '1' };
//   // ctx.set({'connection': 'something',});
//   // ctx.remove('host');
//   // let x = ctx.accepts('html');
//   // ctx.body = x;

//   // ctx.body = ctx.get('connection');
//   // ctx.redirect('http://google.com');
// },
// async ids(ctx) {
//   ctx.body = `id:${ctx.params.id}\n${ctx.search}`;
//   // console.log(ctx.request);
//   ctx.set('x-download-options', 'something');
//   // console.log(ctx.response);
//   // console.log(ctx.query);
// },
// async time(ctx) {
//   const start = new Date();
//   ctx.body = `Time: ${start}`;
// },

// async count(ctx) {
//   i += 1;
//   ctx.body = { count: i };
//   if (i % 2 === 1) {
//     ctx.body.number = 'odd';
//   } else {
//     ctx.body.number = 'even';
//   }
//   cookieDelete(ctx);
// },
// async startover(ctx) {
//   i = 0;
//   ctx.body = 'count reset!';
//   cookieDelete(ctx);
// },
// async today(ctx) {
//   const d = new Date();
//   const ampm = d.getHours() > 12 ? 'pm' : 'am';
//   ctx.body = {
//     date: d.toDateString(),
//     time: `${d.getHours()} : ${d.getMinutes()}${ampm}`,
//   };
//   cookieDelete(ctx);
// },
