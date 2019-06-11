module.exports = {
  async hello(ctx) {
    ctx.body = { resp: 'Check In API' };
  },
  async byebye(ctx) {
    ctx.body = { data: 'good bye' };
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
};
