const { createLogger, format, transports } = require('winston');
// const { isDevelopment } = require('.');

const customFormat = format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

// Configure file logs
const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    customFormat,
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), customFormat),
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
