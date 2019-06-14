/* eslint-disable max-len */
/* eslint-disable  no-process-exit */
const pEvent = require('p-event');
const chalk = require('chalk');

const config = require('./config');
const createServerAndListen = require('./app/serverbuilder');
const logger = require('./app/logger');
const db = require('./app/db');
const app = require('./app/app');

async function main() {
  const host = 'localhost';
  const port = 8080;
  let server;

  try {
    await db.select(db.raw('1'));
    logger.info('Database connected');

    server = await createServerAndListen(app, port, host);
    logger.info('hey we are running');
    logger.info(
      `${chalk.green('✓')} App is running on port `
       + `${chalk.yellow(`${port}`)} in ${chalk.yellow(config.env)} mode`,
    );

    await Promise.race([
      ...['SIGINT', 'SIGHUP', 'SIGTERM'].map(s => pEvent(process, s, {
        rejectionEvents: ['uncaughtException', 'unhandledRejection'],
      })),
    ]);
  } catch (err) {
    process.exitCode = 1;
    logger.fatal(err);
  } finally {
    if (server) {
      logger.debug('Close server');
      await server.stop();
      logger.debug('Server closed');
    }

    logger.debug('Close database');
    await db.destroy();
    logger.debug('Database closed');

    setTimeout(() => process.exit(), 10000).unref();
  }
}

// launch
main();
