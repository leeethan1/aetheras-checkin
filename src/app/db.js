const knex = require('knex');

const knexfile = require('../../knexfile.js').development;

const db = knex(knexfile);


// db.schema.createTable('work', (table) => {
//     table.increments('id');
//     table.string('email');
//     table.timestamp('created_at', {useTz: false}).defaultTo(db.fn.now());
// });

module.exports = db;
