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
    prompt: 'consent',
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
    var fDate = date[0];
    var fTime = date[1];
    var uid;
    var emailaddr;
    const append = ctx.request.query;

    if (append.date && append.time) {
      fDate = append.date;
      fTime = append.time;
    }

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
      ctx.message = 'Already Checked In Today';

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
    var fDate = date[0];
    var fTime = date[1];
    var uid;
    var emailaddr;
    const append = ctx.request.query;

    if (append.date && append.time) {
      fDate = append.date;
      fTime = append.time;
    }

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

      console.log('*****CHECKOUT FAILED: HAVE NOT CHECKED IN*****');
    } else if (!isEmpty(checkouts)) {
      ctx.status = 409;
      ctx.message = 'Already Checked Out Today';

      console.log('*****CHECKOUT FAILED: ALREADY CHECKED OUT*****');
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
    const fname = query.firstname.toLowerCase();
    const lname = query.lastname.toLowerCase();

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
    var x = await db('employees').select('email', 'firstname', 'lastname');
    // x = JSON.stringify(x);
    ctx.response.body = x;
  },

  // creates combined checkin/checkout json
  async userlogs(ctx) {
    const re = new RegExp('@');
    const data = ctx.querystring;
    var emailaddr;
    var table;
    if (re.test(data)) {
      emailaddr = data;
      table = await db('checkin').select(
        'checkin.email', 'checkin.checkdate',
        'checkin.checkintime', 'checkout.checkouttime',
        'employees.firstname', 'employees.lastname',
      )
        .leftJoin('checkout', function () {
          this.onIn('checkin.email', [emailaddr])
            .onIn('checkout.email', [emailaddr])
            .on('checkin.checkdate', '=', 'checkout.checkdate');
        })
        .where('checkin.email', emailaddr)
        .innerJoin('employees', 'employees.id', 'checkin.id');
      console.log(table);
    } else {
      try {
        const fname = data.split('-')[0].toLowerCase();
        const lname = data.split('-')[1].toLowerCase();
        const x = await db('employees').select('email').whereRaw(
          'LOWER(firstname) = ?', fname,
        ).andWhereRaw(
          'LOWER(lastname) = ?', lname,
        );
        if (!isEmpty(x)) {
          emailaddr = x[0].email;
          table = await db('checkin').select(
            'checkin.email', 'checkin.checkdate',
            'checkin.checkintime', 'checkout.checkouttime',
            'employees.firstname', 'employees.lastname',
          )
            .leftJoin('checkout', function () {
              this.onIn('checkin.email', [emailaddr])
                .onIn('checkout.email', [emailaddr])
                .on('checkin.checkdate', '=', 'checkout.checkdate');
            })
            .where('checkin.email', emailaddr)
            .innerJoin('employees', 'employees.id', 'checkin.id');
          console.log(table);
        } else {
          table = [];
        }
      } catch (err) {
        throw err;
      }
    }
    ctx.response.body = table;
  },

  async oauth2(ctx) {
    const { code } = ctx.request.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      if (await authenticate()) {
        var decoded = jwt.decode(tokens.id_token, { complete: true });
        const ids = await db('employees')
          .where({ email: decoded.payload.email })
          .select('id');
        const admins = await db('admins')
          .where({ email: decoded.payload.email })
          .select();
        if (!isEmpty(admins)) {
          ctx.cookies.set('isAdmin', 'true', {
            signed: true,
            httpOnly: false,
            maxAge: 64800000,
          });
        } else {
          ctx.cookies.set('isAdmin', 'false', {
            signed: true,
            httpOnly: false,
            maxAge: 64800000,
          });
        }
        ctx.cookies.set('id', ids[0].id, {
          signed: true,
          httpOnly: false,
          maxAge: 64800000,
        });
        ctx.cookies.set('inDatabase', 'true', {
          signed: true,
          httpOnly: false,
          maxAge: 5000,
          overwrite: true,
        });

        if (tokens.refresh_token) {
          await db('employees').update({ refresh_token: tokens.refresh_token })
            .where({ email: decoded.payload.email });
        }
      } else {
        ctx.cookies.set('inDatabase', 'false', {
          signed: true,
          httpOnly: false,
          maxAge: 5000,
          overwrite: true,
        });
      }
      // get the decoded payload and header

      // console.log(decoded.header);
      // console.log(decoded.payload);
    } catch (e) {
      console.log(e);
    }
    ctx.status = 308;
    ctx.response.redirect('http://localhost:5000');
  },

  async login(ctx) {
    ctx.status = 308;
    ctx.response.redirect(getGoogleAuthURL(['email', 'profile', 'openid']));
    // ctx.response.body = ({ url: getGoogleAuthURL(['email', 'profile', 'openid']) });
  },

  async checkcookie(ctx) {
    try {
      var reqid = ctx.cookies.get('id', { signed: true });
      ctx.cookies.get('isAdmin', { signed: true });
      const data = await db('employees').where({ id: reqid })
        .select('refresh_token', 'email');
      const { tokens } = await oauth2Client.refreshToken(data[0].refresh_token);
      // console.log(tokens)
      oauth2Client.setCredentials(tokens);
      ctx.status = 200;
      ctx.message = data[0].email;
    } catch (err) {
      console.log(err);
    }
  },

  async writeCSV(ctx) {
    const data = ctx.query;
    var start; var end; var line;
    [start, end] = [data.start, data.end];

    const table = await db('checkin').select()
      .innerJoin('checkout', function () {
        this.on('checkin.email', '=', 'checkout.email')
          .on('checkin.checkdate', '=', 'checkout.checkdate');
      })
      .innerJoin('employees', 'employees.id', 'checkin.id');

    fs.writeFileSync('logs.csv', 'Email,First Name,Last Name,Date,Checkin,Checkout\n');
    table.forEach((param) => {
      if (param.checkdate >= start && param.checkdate <= end) {
        line = param.email;
        line = `${line},${param.firstname},${param.lastname},${param.checkdate},${param.checkintime},${param.checkouttime}\n`;
        fs.appendFileSync('logs.csv', line);
        ctx.response.attachment('logs.csv');
        ctx.response.body = fs.createReadStream(`${__dirname}/../../logs.csv`);
        console.log(line);
      }
    });
    console.log(ctx.response.header);
  },
};
