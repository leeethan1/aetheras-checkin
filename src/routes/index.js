const Router = require('koa-router');

const router = new Router();
const api = new Router();
// const auth = require("../middleware/auth-required-middleware")

api.use(require('./sample-routes'));

router.use('/v1', api.routes());

module.exports = router;
