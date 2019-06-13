const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

// router.get('/sample', samplesRoute.hello);
// router.get('/sample2', samplesRoute.byebye);
// router.get('/tests', samplesRoute.tests);
// router.get('/dyn/:id/', samplesRoute.ids);
// router.get('/time', samplesRoute.time);
// router.get('/sample3', samplesRoute.count);
// router.get('/sample4', samplesRoute.startover);
// router.get('/sample5', samplesRoute.today);
router.get('/checkin', samplesRoute.checkin);
router.get('/checkout', samplesRoute.checkout);


module.exports = router.routes();
