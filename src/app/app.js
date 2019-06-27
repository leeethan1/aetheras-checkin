// const logger = require('./config/logging');
// const injectSchema = require('../schemas');
// const { isDevelopment } = require('./config');
const Koa = require('koa');
// injectSchema(app);
const responseTime = require('koa-response-time');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const xRequestId = require('koa-x-request-id');
const cors = require('kcors');
// const jwt = require("../middleware/jwt-middleware");
const bodyParser = require('koa-bodyparser');

const routes = require('../routes');

const app = new Koa();
app.proxy = true;
app.keys = ['key1', 'key2'];

app.use(responseTime());
app.use(xRequestId({ inject: true }, app));
app.use(logger());
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5000', // change this in production
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true,
  }),
);

// app.use(camelizeMiddleware);

// app.use(error);
// app.use(jwt);
app.use(
  bodyParser({
    enableTypes: ['json'],
  }),
);

app.use(routes.routes());
app.use(routes.allowedMethods());

module.exports = app;
