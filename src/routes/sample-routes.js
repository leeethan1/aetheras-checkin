const Router = require('koa-router');
const multer = require('koa-multer');

const ctrl = require('../controllers');

const upload = multer({ dest: 'uploads/' });


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
router.put('/employeeUpload', upload.single('names'), samplesRoute.employeeUpload);
router.get('/writeEmployeeCSV', samplesRoute.writeEmployeeCSV);


module.exports = router.routes();
