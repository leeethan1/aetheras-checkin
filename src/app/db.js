const knex = require('knex');

const config = require('../../database.json');
// conforming db migrate model to knexfile model

const knexOptions = {
  client: config.dev.driver,
  connection: {
    host: config.dev.host,
    port: config.dev.port,
    database: config.dev.database,
    user: config.dev.user,
    password: config.dev.password,
  },
};
const db = knex(knexOptions);

module.exports = db;
