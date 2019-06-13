/* eslint-disable */
const knexfile = require('../knexfile.js').development;

const knex = require('knex')(knexfile);


const ethan = [{
  email: 'ethan@ethan.com', checkdate: '2019-06-13', checkintime: '10:00', checkouttime: '17:00',
}];
knex('checkin').insert(ethan).then(() => console.log('data inserted'))
  .catch((err) => { console.log(err); throw err; })
  .finally(() => {
    knex.destroy();
  });

console.log('done!');
