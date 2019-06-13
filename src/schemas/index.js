/* eslint-disable no-param-reassign */
const sample = require('./sample-schema');

module.exports = (app) => {
  app.schemas = {
    sample,
  };
};
