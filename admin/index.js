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

async function userlogs() {
  const info = prompt('Enter Email:');
  const url = 'http://localhost:8080/v1/userlogs';

  if (info !== null) {
    var resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: info }),
    });
    var x = await resp.json();

    // CHANGE DISPLAY METHOD
    var tr = document.createElement("TR");
    document.body.appendChild(tr);
    var th = document.createElement("TH");
    th.innerHTML = "First Name";
    document.body.appendChild(th);
    var th = document.createElement("TH");
    th.innerHTML = "Last Name";
    document.body.appendChild(th);
    var th = document.createElement("TH");
    th.innerHTML = "Email";
    document.body.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Date";
    document.body.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Check In Time";
    document.body.appendChild(th);
    th = document.createElement("TH");
    th.innerHTML = "Check Out Time";
    document.body.appendChild(th);
    for (xs in x) {
      var tr = document.createElement("TR");
      document.body.appendChild(tr);
      var td = document.createElement("TD");
      td.innerHTML = x[xs].firstname;
      document.body.appendChild(td);
      var td = document.createElement("TD");
      td.innerHTML = x[xs].lastname;
      document.body.appendChild(td);
      var td = document.createElement("TD");
      td.innerHTML = x[xs].email;
      document.body.appendChild(td);
      td = document.createElement("TD");
      td.innerHTML = x[xs].checkdate;
      document.body.appendChild(td);
      td = document.createElement("TD");
      td.innerHTML = x[xs].checkintime;
      document.body.appendChild(td);
      td = document.createElement("TD");
      td.innerHTML = x[xs].checkouttime;
      document.body.appendChild(td);
      console.log(x[xs].checkdate, x[xs].checktime);
      // var par = document.createElement("P");
      // par.innerHTML = `${x[xs].email} ${x[xs].checkdate} ${x[xs].checktime}`;
      // document.body.appendChild(par);
    }
  } else {
    console.log('no input');
    return;
  }
}
