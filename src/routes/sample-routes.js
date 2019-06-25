const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

router.get('/checkin', samplesRoute.checkin);
router.get('/checkout', samplesRoute.checkout);
router.post('/emailreg', samplesRoute.addemail);
router.get('/employees', samplesRoute.employees);
router.get('/userlogs', samplesRoute.userlogs);
router.get('/oauth2', samplesRoute.oauth2);
router.get('/login', samplesRoute.login);
router.get('/writeCSV', samplesRoute.writeCSV);
router.get('/checkcookie', samplesRoute.checkcookie);


module.exports = router.routes();
