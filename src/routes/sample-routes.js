const Router = require('koa-router');
const multer = require('koa-multer');

const ctrl = require('../controllers');

const upload = multer({ dest: 'uploads/' });

const samplesRoute = ctrl.sample;

const router = new Router();

router.get('/login', samplesRoute.login);
router.get('/oauth2', samplesRoute.oauth2);
router.get('/checkCookies', samplesRoute.checkCookies);
router.get('/checkIn', samplesRoute.checkIn);
router.get('/checkOut', samplesRoute.checkOut);
router.post('/addAdmin', samplesRoute.addAdmin);
router.get('/viewEmployees', samplesRoute.viewEmployees);
router.get('/viewUserLogs', samplesRoute.viewUserLogs);
router.get('/downloadUserLogsCSV', samplesRoute.downloadUserLogsCSV);
router.put('/uploadEmployeeCSV', upload.single('names'), samplesRoute.uploadEmployeeCSV);
router.get('/downloadEmployeeCSV', samplesRoute.downloadEmployeeCSV);

module.exports = router.routes();
