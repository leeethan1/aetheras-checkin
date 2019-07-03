/* eslint-disable func-names */
/* eslint-disable no-console */

const { types } = require('pg');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const csv = require('csv-parser');

const db = require('../app/db');

// Keeps consistent date across PostgreSQL and Javascript date types
const TYPE_DATESTAMP = 1082;
types.setTypeParser(TYPE_DATESTAMP, date => date);

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

  return authorizeUrl;
}

function isEmpty(table) {
  if (table.length === 0) {
    return true;
  }
  return false;
}

function getFormattedDateTime() {
  const start = new Date();
  const year = start.getFullYear();
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const minutes = start.getMinutes();
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}`;

  return [formattedDate, formattedTime];
}

async function authenticate() {
  const decoded = jwt.decode(oauth2Client.credentials.id_token,
    { complete: true });
  if (decoded != null) {
    const user = await db('employees').select('email')
      .where({
        email: decoded.payload.email,
      });
    if (!isEmpty(user)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  async login(ctx) {
    ctx.status = 308;
    ctx.response.redirect(getGoogleAuthURL(['email', 'profile', 'openid']));
  },

  async oauth2(ctx) {
    const { code } = ctx.request.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      if (await authenticate()) {
        const decoded = jwt.decode(tokens.id_token, { complete: true });
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
            maxAge: 57600000,
            overwrite: true,
          });
        } else {
          ctx.cookies.set('isAdmin', 'false', {
            signed: true,
            httpOnly: false,
            maxAge: 57600000,
            overwrite: true,
          });
        }
        ctx.cookies.set('id', ids[0].id, {
          signed: true,
          httpOnly: false,
          maxAge: 57600000,
          overwrite: true,
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
    } catch (e) {
      console.log(e);
    }
    ctx.status = 308;
    ctx.response.redirect('http://localhost:5000');
  },

  async checkCookies(ctx) {
    try {
      const userID = ctx.cookies.get('id', { signed: true });
      ctx.cookies.get('isAdmin', { signed: true });
      const table = await db('employees').where({ id: userID })
        .select('refresh_token', 'email');
      const { tokens } = await oauth2Client.refreshToken(table[0].refresh_token);

      oauth2Client.setCredentials(tokens);
      ctx.status = 200;
      ctx.message = table[0].email;
    } catch (err) {
      console.log(err);
    }
  },

  async checkIn(ctx) {
    const dateTime = ctx.request.query;
    const date = getFormattedDateTime();
    let formattedDate = date[0];
    let formattedTime = date[1];
    let emailAddress;
    let uid;

    if (dateTime.date && dateTime.time) {
      formattedDate = dateTime.date;
      formattedTime = dateTime.time;
    }

    console.log('+++CHECKING IN+++\n');

    // checks whether email exists in database
    if (await authenticate()) {
      const decoded = jwt.decode(oauth2Client.credentials.id_token,
        { complete: true });
      emailAddress = decoded.payload.email;
      uid = await db('employees').where({
        email: emailAddress,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    // checks whether user has already checked in today
    const checkins = await db('checkin').where({
      email: emailAddress,
      checkdate: formattedDate,
    }).select();

    if (!isEmpty(checkins)) {
      ctx.status = 409;
      ctx.message = 'Already Checked In Today';

      console.log('*****ALREADY CHECKED IN*****');
    } else {
      await db('checkin').insert({
        id: uid,
        email: emailAddress,
        checkdate: formattedDate,
        checkintime: formattedTime,
      });
      ctx.status = 200;

      const x = await db('checkin').select().where({
        email: emailAddress,
        checkdate: formattedDate,
      });
      console.log(x);
      console.log('+++CHECKED IN+++');
    }
  },

  async checkOut(ctx) {
    const dateTime = ctx.request.query;
    const date = getFormattedDateTime();
    let formattedDate = date[0];
    let formattedTime = date[1];
    let emailAddress;
    let uid;

    if (dateTime.date && dateTime.time) {
      formattedDate = dateTime.date;
      formattedTime = dateTime.time;
    }

    console.log('+++CHECKING OUT+++\n');

    // checks whether email exists in database
    if (await authenticate()) {
      const decoded = jwt.decode(oauth2Client.credentials.id_token,
        { complete: true });
      emailAddress = decoded.payload.email;
      uid = await db('employees').where({
        email: emailAddress,
      }).select('id');
      uid = uid[0].id;
    } else {
      ctx.status = 409;
      ctx.message = 'Email Does Not Exist';

      console.log('*****EMAIL DOES NOT EXIST*****');

      return;
    }

    // checks whether user has checked in or checked out today
    const checkins = await db('checkin').where({
      email: emailAddress,
      checkdate: formattedDate,
    }).select();
    const checkouts = await db('checkout').where({
      email: emailAddress,
      checkdate: formattedDate,
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
        id: uid,
        email: emailAddress,
        checkdate: formattedDate,
        checkouttime: formattedTime,
      });
      ctx.status = 200;

      const x = await db('checkout').select().where({
        email: emailAddress,
        checkdate: formattedDate,
      });
      console.log(x);
      console.log('+++CHECKED OUT+++');
    }
  },

  async addAdmin(ctx) {
    const query = ctx.request.body;
    const emailAddress = query.email;
    const firstName = query.firstname.toLowerCase();
    const lastName = query.lastname.toLowerCase();

    // checks if email is already added to the registry
    try {
      await db('admins').insert({
        email: emailAddress,
        firstname: firstName,
        lastname: lastName,
      });
      ctx.status = 200;
      ctx.message = `Added Email ${emailAddress}`;

      const x = await db('admins').select();
      console.log(x);
      console.log('ADDED');
    } catch (err) {
      console.log(err);
      ctx.status = 409;
      ctx.message = 'Email Already Exists';
    }
  },

  async viewEmployees(ctx) {
    const table = await db('employees').select('email', 'firstname', 'lastname');
    ctx.response.body = table;
  },

  // creates combined checkin/checkout json
  async viewUserLogs(ctx) {
    const re = new RegExp('@');
    const data = ctx.querystring;
    let emailAddress;
    let table;

    if (re.test(data)) {
      emailAddress = data;
      table = await db('checkin').select(
        'checkin.email', 'checkin.checkdate',
        'checkin.checkintime', 'checkout.checkouttime',
        'employees.firstname', 'employees.lastname',
      )
        .leftJoin('checkout', function () {
          this.onIn('checkin.email', [emailAddress])
            .onIn('checkout.email', [emailAddress])
            .on('checkin.checkdate', '=', 'checkout.checkdate');
        })
        .where('checkin.email', emailAddress)
        .orderBy([{ column: 'email' }, { column: 'checkdate', order: 'desc' }])
        .innerJoin('employees', 'employees.id', 'checkin.id');
      console.log(table);
    } else {
      try {
        const firstName = data.split('-')[0].toLowerCase();
        const lastName = data.split('-')[1].toLowerCase();
        const emails = await db('employees').select('email').whereRaw(
          'LOWER(firstname) = ?', firstName,
        ).andWhereRaw(
          'LOWER(lastname) = ?', lastName,
        );
        if (!isEmpty(emails)) {
          emailAddress = emails[0].email;
          table = await db('checkin').select(
            'checkin.email', 'checkin.checkdate',
            'checkin.checkintime', 'checkout.checkouttime',
            'employees.firstname', 'employees.lastname',
          )
            .leftJoin('checkout', function () {
              this.onIn('checkin.email', [emailAddress])
                .onIn('checkout.email', [emailAddress])
                .on('checkin.checkdate', '=', 'checkout.checkdate');
            })
            .where('checkin.email', emailAddress)
            .orderBy([{ column: 'email' }, { column: 'checkdate', order: 'desc' }])
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

  async downloadUserLogsCSV(ctx) {
    const re = new RegExp('@');
    const queryData = ctx.query;
    const startDate = queryData.start;
    const endDate = queryData.end;
    let emailAddress = queryData.info;
    let line;
    let table;
    let stream;

    if (!queryData.info) {
      table = await db('checkin').select(
        'checkin.email', 'checkin.checkdate',
        'checkin.checkintime', 'checkout.checkouttime',
        'employees.firstname', 'employees.lastname',
      )
        .leftJoin('checkout', function () {
          this.on('checkin.email', '=', 'checkout.email')
            .on('checkin.checkdate', '=', 'checkout.checkdate');
        })
        .innerJoin('employees', 'employees.id', 'checkin.id');
      console.log(table);
    } else if (re.test(emailAddress)) {
      table = await db('checkin').select(
        'checkin.email', 'checkin.checkdate',
        'checkin.checkintime', 'checkout.checkouttime',
        'employees.firstname', 'employees.lastname',
      )
        .leftJoin('checkout', function () {
          this.on('checkin.email', '=', 'checkout.email')
            .on('checkin.checkdate', '=', 'checkout.checkdate');
        })
        .where('checkin.email', emailAddress)
        .orderBy([{ column: 'email' }, { column: 'checkdate' }])
        .innerJoin('employees', 'employees.id', 'checkin.id');
      console.log(table);
    } else {
      try {
        const firstName = queryData.info.split('-')[0].toLowerCase();
        const lastName = queryData.info.split('-')[1].toLowerCase();
        const emails = await db('employees').select('email').whereRaw(
          'LOWER(firstname) = ?', firstName,
        ).andWhereRaw(
          'LOWER(lastname) = ?', lastName,
        );
        if (!isEmpty(emails)) {
          emailAddress = emails[0].email;
          table = await db('checkin').select(
            'checkin.email', 'checkin.checkdate',
            'checkin.checkintime', 'checkout.checkouttime',
            'employees.firstname', 'employees.lastname',
          )
            .leftJoin('checkout', function () {
              this.on('checkin.email', '=', 'checkout.email')
                .on('checkin.checkdate', '=', 'checkout.checkdate');
            })
            .where('checkin.email', emailAddress)
            .orderBy([{ column: 'email' }, { column: 'checkdate' }])
            .innerJoin('employees', 'employees.id', 'checkin.id');
          console.log(table);
        } else {
          table = [];
        }
      } catch (err) {
        throw err;
      }
    }

    fs.writeFileSync('logs.csv', 'Email,First Name,Last Name,Date,Checkin,Checkout\n');
    table.forEach((param) => {
      if (param.checkdate >= startDate && param.checkdate <= endDate) {
        line = param.email;
        line = `${line},${param.firstname},${param.lastname},${param.checkdate},${param.checkintime},${param.checkouttime}\n`;
        fs.appendFileSync('logs.csv', line);
        ctx.response.attachment('logs.csv');
        stream = fs.createReadStream(`${__dirname}/../../logs.csv`);
        ctx.response.body = stream;
        console.log(line);
      }
    });
    stream.on('end', () => fs.unlinkSync(`${__dirname}/../../logs.csv`));
  },

  async uploadEmployeeCSV(ctx) {
    const file = fs.readdirSync(`${__dirname}/../../uploads/`);
    const src = fs.createReadStream(`${__dirname}/../../uploads/${file[0]}`);
    const people = [];

    src.pipe(csv())
      .on('data', (chunk) => {
        if (chunk.Email && chunk['First Name'] && chunk['Last Name']) {
          people.push(chunk);
        }
      })
      .on('end', async () => {
        await Promise.all(people.map(async (x) => {
          try {
            await db('employees').insert({
              email: x.Email,
              firstname: x['First Name'],
              lastname: x['Last Name'],
            });
          } catch (err) {
            // FIX ERROR REPORTING
            console.log(`Already in Database: ${x.Email}`);
          }
        }));
        fs.unlinkSync(`${__dirname}/../../uploads/${file[0]}`);
      });
    ctx.status = 200;
  },

  async downloadEmployeeCSV(ctx) {
    const table = await db('employees').select('email', 'firstname', 'lastname');
    let line;
    let stream;

    fs.writeFileSync('employees.csv', 'Email,First Name,Last Name\n');
    await table.forEach((param) => {
      line = param.email;
      line = `${line},${param.firstname},${param.lastname}\n`;
      fs.appendFileSync('employees.csv', line);
      ctx.response.attachment('employees.csv');
      stream = fs.createReadStream(`${__dirname}/../../employees.csv`);
      ctx.response.body = stream;
      console.log(line);
    });
    stream.on('end', () => fs.unlinkSync(`${__dirname}/../../employees.csv`));
  },
};
