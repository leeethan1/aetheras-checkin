/* eslint-disable */
// fetch('http://localhost:8080/v1/sample').then((resp) => {
//     console.log(resp);
//     resp.json().then((data) => {
//         console.log(data);
//         document.getElementById("status").innerHTML = data.resp;
//     });
// });

async function main() {
  const resp = await fetch('http://localhost:8080/v1/tests');
  console.log(resp);
  console.log(resp.headers.get('hello'));
  // var data = await resp.json();
  // document.getElementById("status").innerHTML = data.resp;
}
main();
