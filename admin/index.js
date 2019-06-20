/* eslint-disable */
//const ADMINPASS = 'admin123';

async function addEmail() {
  var info = prompt('email, firstname, lastname');
  if (!info) {
    return;
  }
  var infoarr = info.split(', ');

  var emailadr = infoarr[0];
  var fname = infoarr[1];
  var lname = infoarr[2];

  const url = 'http://localhost:8080/v1/emailreg';
  var resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: emailadr, firstname: fname, lastname: lname }),
  });
  var status = resp.status;
  var msg;
  if (status == 200) {
    msg = '-Added email ' + emailadr;
  } else {
    msg = '-Email did not add';
  }

  var h = document.createElement("h4");
  var node = document.createTextNode(msg);
  h.appendChild(node);

  var element = document.getElementById("div1");
  element.appendChild(h);

  console.log(status);
}

async function viewEmail() {
  const url = 'http://localhost:8080/v1/employees';
  var resp = await fetch(url, {
  });
  console.log(resp.statusText);
  var h = document.createElement("h4");
  var node = document.createTextNode(resp.statusText);
  h.appendChild(node);

  var element = document.getElementById("div1");
  element.appendChild(h);
}
