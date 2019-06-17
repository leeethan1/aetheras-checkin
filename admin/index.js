/* eslint-disable */
//const ADMINPASS = 'admin123';

async function addEmail() {
  var info = prompt('email, firstname, lastname');
  var infoarr = info.split(', ');

  var email = infoarr[0];
  var firstName = infoarr[1];
  var lastName = infoarr[2];

  const url = `http://localhost:8080/v1/emailreg?${email}&${firstName}&${lastName}`;
  var resp = await fetch(url, {
  });

}

