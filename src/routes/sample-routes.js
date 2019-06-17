const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

router.get('/checkin', samplesRoute.checkin);
router.get('/checkout', samplesRoute.checkout);
router.get('/emailreg', samplesRoute.addemail);


module.exports = router.routes();
