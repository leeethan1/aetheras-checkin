const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();


router.post('/checkin', samplesRoute.checkin);
router.post('/checkout', samplesRoute.checkout);
router.post('/emailreg', samplesRoute.addemail);
router.get('/employees', samplesRoute.employees);


module.exports = router.routes();
