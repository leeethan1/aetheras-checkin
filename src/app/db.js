const knex = require('knex');

const config = require('../../database.json');
// conforming db migrate model to knexfile model
const hostport = config.dev.host.split(':');
const knexOptions = {
  client: config.dev.driver,
  connection: {
    host: hostport[0],
    port: hostport[1],
    database: config.dev.database,
    user: config.dev.user,
    password: config.dev.password,
  },
};
const db = knex(knexOptions);


// db.schema.createTable('work', (table) => {
//     table.increments('id');
//     table.string('email');
//     table.timestamp('created_at', {useTz: false}).defaultTo(db.fn.now());
// });

module.exports = db;
