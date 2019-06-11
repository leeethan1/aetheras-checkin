const Router = require('koa-router');

const ctrl = require('../controllers');

const samplesRoute = ctrl.sample;

const router = new Router();

router.get('/sample', samplesRoute.hello);
router.get('/sample2', samplesRoute.byebye);
router.get('/tests', samplesRoute.tests);
router.get('/dyn/:id/', samplesRoute.ids);
router.get('/time', samplesRoute.time);

module.exports = router.routes();
