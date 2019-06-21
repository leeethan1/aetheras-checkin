/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */

const { types } = require('pg');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const db = require('../app/db');


const oauth2Client = new google.auth.OAuth2(
  '934270667898-sppb26nd1avnfa3dbm1ps0rp385ar6hp.apps.googleusercontent.com',
  'EUiHjSdbgLrdi7tYMYa5yvqV',
  'http://localhost:8080/v1/oauth2',
);

google.options({ auth: oauth2Client });

function getGoogleAuthURL(scopes) {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });

  // ctx.response.redirect(authorizeUrl);
  return authorizeUrl;
}

const TYPE_DATESTAMP = 1082;
types.setTypeParser(TYPE_DATESTAMP, date => date);

// checks if object is empty
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function getFDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const minutes = start.getMinutes();
  const fDate = `${year}-${month}-${day}`;
  const fTime = `${hours}:${minutes}`;

  return [fDate, fTime];
}

async function authenticate() {
  var decoded = jwt.decode(oauth2Client.credentials.id_token,
    { complete: true });
  if (decoded != null) {
    const user = await db('employees').select('email')
      .where({
        email: decoded.payload.email,
        firstname: decoded.payload.given_name,
        lastname: decoded.payload.family_name,
      });
    console.log(decoded.payload.email);
    if (!isEmpty(user)) {
      console.log('TRUE');
      return true;
    }
  }
  console.log('FALSE');
  return false;
}

module.exports = {

  async checkin(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    var uid;
    var emailaddr;


    // console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('+++CHECKING IN+++\n');

    // checks whether email exists in database
    if (await authenticate()) {
      var decoded = jwt.decode(oauth2Client.credentials.id_token,
        { complete: true });
      emailaddr = decoded.payload.email;
      uid = await db('employees').where({
        email: emailaddr,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    // checks whether user has already checked in today
    var checkins = await db('checkin').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();

    if (!isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'Already Checked In';

      console.log('*****ALREADY CHECKED IN*****');
    } else {
      // add row to checkin table
      await db('checkin').insert({
        id: uid,
        email: emailaddr,
        checkdate: fDate,
        checkintime: fTime,
      });
      ctx.status = 200;

      // print out checkin table
      const x = await db('checkin').select().where({
        email: emailaddr,
        checkdate: fDate,
      });
      console.log(x);
      console.log('+++CHECKED IN+++');
    }
  },

  async checkout(ctx) {
    const date = getFDateTime();
    const fDate = date[0];
    const fTime = date[1];
    var uid;
    var emailaddr;

    // console.log(`${fDate} ${fTime} ${emailaddr}`);
    console.log('+++CHECKING OUT+++\n');

    // checks whether email exists in database
    if (await authenticate()) {
      var decoded = jwt.decode(oauth2Client.credentials.id_token,
        { complete: true });
      emailaddr = decoded.payload.email;
      uid = await db('employees').where({
        email: emailaddr,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    // checks whether user has checked in or checked out today
    var checkins = await db('checkin').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();
    var checkouts = await db('checkout').where({
      email: emailaddr,
      checkdate: fDate,
    }).select();

    if (isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'You have not checked in yet';

      console.log('*****CHECKOUT FAILED: ALREADY CHECKED OUT*****');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out';

      console.log('*****CHECKOUT FAILED: ALREADY CHECKED IN*****');
    } else {
      await db('checkout').insert({
        // add row to checkout table
        id: uid,
        email: emailaddr,
        checkdate: fDate,
        checkouttime: fTime,
      });
      ctx.status = 200;

      // prints out checkout table
      const x = await db('checkout').select().where({
        email: emailaddr,
        checkdate: fDate,
      });
      console.log(x);
      console.log('+++CHECKED OUT+++');
    }
  },

  async addemail(ctx) {
    ctx.body = 'Adding email';
    const query = ctx.request.body;
    const emailaddr = query.email;
    const fname = query.firstname;
    const lname = query.lastname;

    // checks if email is already added to the registry
    try {
      await db('employees').insert({
        email: emailaddr,
        firstname: fname,
        lastname: lname,
      });
      ctx.status = 200;

      var x = await db('employees').select();
      console.log(x);
      console.log('ADDED');
    } catch (err) {
      ctx.status = 409;
      ctx.message = err;
      throw err;
    }
  },

  async employees(ctx) {
    ctx.body = 'Viewing employees';
    var x = await db('employees').select('email');
    x = JSON.stringify(x);
    ctx.message = x;
  },

  // creates combined checkin/checkout json
  async userlogs(ctx) {
    const emailaddr = ctx.querystring;
    console.log(emailaddr);

    const table = await db('checkin').select()
      .innerJoin('checkout', function () {
        this.onIn('checkin.email', [emailaddr])
          .onIn('checkout.email', [emailaddr])
          .on('checkin.checkdate', '=', 'checkout.checkdate');
      })
      .innerJoin('employees', 'employees.id', 'checkin.id');
    console.log(table);

    ctx.response.body = table;
  },

  async oauth2(ctx) {
    const { code } = ctx.request.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      if (await authenticate()) {
        var decoded = jwt.decode(tokens.id_token, { complete: true });

        if (tokens.refresh_token) {
          await db('employees').update({ refresh_token: tokens.refresh_token })
            .where({ email: decoded.payload.email });
        }
      }
      // get the decoded payload and header

      // console.log(decoded.header);
      // console.log(decoded.payload);
    } catch (e) {
      console.log(e);
    }
    ctx.response.redirect('http://192.168.1.68:5000');
  },

  async login(ctx) {
    // getGoogleAuthURL(ctx, ['email', 'profile', 'openid']);
    ctx.response.body = ({ url: getGoogleAuthURL(['email', 'profile', 'openid']) });
  },

  async writeCSV() {
    const table = await db('checkin').select()
      .innerJoin('checkout', function () {
        this.on('checkin.email', '=', 'checkout.email')
          .on('checkin.checkdate', '=', 'checkout.checkdate');
      })
      .innerJoin('employees', 'employees.id', 'checkin.id');
    var x = JSON.stringify(table);
    x = JSON.parse(x);

    fs.writeFileSync('logs.txt', 'TableID,ID,First Name,Last Name,Email,Date,Checkin,Checkout\n');
    x.forEach((param) => {
      var line = param.table_id;
      line = `${line},${param.id},${param.firstname},${param.lastname},${param.email},${param.checkdate},${param.checkintime},${param.checkouttime}
`;
      fs.appendFileSync('logs.txt', line);
      // line = line.replace(/"/g, '');
      // line = `${line.slice(1, line.lastIndexOf('}'))}`;

      console.log(line);
    });
    // console.log(x);
  },
};
