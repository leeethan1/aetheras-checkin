const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

// fix later
router.get('/checkin', samplesRoute.checkin);
router.get('/checkout', samplesRoute.checkout);
router.get('/emailreg', samplesRoute.addemail);
router.post('/checkin', samplesRoute.checkin);
router.post('/checkout', samplesRoute.checkout);
router.get('/employees', samplesRoute.employees);
router.post('/userlogs', samplesRoute.userlogs);


module.exports = router.routes();
