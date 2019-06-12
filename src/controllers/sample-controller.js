let i = 0;
const cookieDelete = function (ctx) {
  ctx.cookies.set('name', '', { httpOnly: false });
};
module.exports = {
  async hello(ctx) {
    ctx.body = { resp: 'hello' };
    ctx.redirect('./sample2');
    ctx.cookies.set('name', 'ethan', { httpOnly: false });
  },
  async byebye(ctx) {
    ctx.body = {
      resp: 'bye',
      name: ctx.cookies.get('name'),
    };
    ctx.body.redirected = ctx.cookies.get('name') ? 'yes' : 'no';
    // console.log(ctx.status);
    cookieDelete(ctx);
  },
  async tests(ctx) {
    ctx.append('hello', 'header');
    ctx.body = { data: 'blah' };
    // ctx.querystring = { next: '0' };
    // ctx.query = { next: '1' };
    // ctx.set({'connection': 'something',});
    // ctx.remove('host');
    // let x = ctx.accepts('html');
    // ctx.body = x;

    // ctx.body = ctx.get('connection');
    // ctx.redirect('http://google.com');
  },
  async ids(ctx) {
    ctx.body = `id:${ctx.params.id}\n${ctx.search}`;
    // console.log(ctx.request);
    ctx.set('x-download-options', 'something');
    // console.log(ctx.response);
    // console.log(ctx.query);
  },
  async time(ctx) {
    const start = new Date();
    ctx.body = `Time: ${start}`;
  },

  async count(ctx) {
    i += 1;
    ctx.body = { count: i };
    if (i % 2 === 1) {
      ctx.body.number = 'odd';
    } else {
      ctx.body.number = 'even';
    }
    cookieDelete(ctx);
  },
  async startover(ctx) {
    i = 0;
    ctx.body = 'count reset!';
    cookieDelete(ctx);
  },
  async today(ctx) {
    const d = new Date();
    const ampm = d.getHours() > 12 ? 'pm' : 'am';
    ctx.body = {
      date: d.toDateString(),
      time: `${d.getHours()} : ${d.getMinutes()}${ampm}`,
    };
    cookieDelete(ctx);
  },
  async checkin(ctx) {
    const start = new Date();
    console.log(start);
    const q = ctx.request.querystring;
    console.log(q);
    console.log('checking in');
  },
  async checkout(ctx) {
    const start = new Date();
    console.log(start);
    const q = ctx.request.querystring;
    console.log(q);
    console.log('checking out');
  },


};
