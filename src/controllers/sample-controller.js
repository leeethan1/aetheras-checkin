module.exports = {
  async hello(ctx) {
    // const { body } = ctx.request;
    ctx.body = { resp: 'Check In API' };
  },
  async byebye(ctx) {
    ctx.body = { data: 'good bye' };
  },
};
