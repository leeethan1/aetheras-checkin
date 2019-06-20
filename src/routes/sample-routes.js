const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

router.post('/checkin', samplesRoute.checkin);
router.post('/checkout', samplesRoute.checkout);
router.post('/emailreg', samplesRoute.addemail);
router.get('/employees', samplesRoute.employees);
router.post('/userlogs', samplesRoute.userlogs);
router.get('/oauth2', samplesRoute.oauth2);
router.get('/login', samplesRoute.login);


module.exports = router.routes();
