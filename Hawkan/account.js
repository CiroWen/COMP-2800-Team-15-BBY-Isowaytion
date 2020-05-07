const express = require('express');
const app = express();

//Lenght of info array
const LENGTH = 3;

//Current user info, array
let currentInfo = new Array(LENGTH);

/************************************************
 * Accessing user database
 */
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "205.250.9.115",
  user: "root",
  password: "123",
  database: "isowaytion"
});

app.listen(1515, () => console.log(`Hawkan listening on ${1515}`));

//Grab current user information

con.query("SELECT * FROM isowaytion WHERE email = 'hawkan.zheng@gmail.com'", (err, rows) => { //need to implement current user email
  if (err) throw err;

  console.log('Data received from isowaytion.');

  //Store in user info array, {email, name, address}
  currentInfo = [rows[0].Email, rows[0].Name, rows[0].Address];
});

/************************************
 * Express server side
 */
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/account", (req, res) => {

  //pass info to account page when rendered
  res.render("pages/account", { currentInfo: currentInfo});
});

app.post("/account", (req, res) => {
  let userData = req.body;
  console.log(userData);
  let newName = userData.username;
  let newAddress = userData.address;

  //Update name field
  if (newName != '') {
    var sql = `UPDATE isowaytion SET name = '${newName}' WHERE email = '${currentInfo[0]}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  }

  //Update address field
  if (newAddress != '') {
    var sql = `UPDATE isowaytion SET address = '${newAddress}' WHERE email = '${currentInfo[0]}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  }

  //Show updated info
  if(newName != '' && newAddress != ''){

    //update name and address in current info array
    currentInfo[1] = newName;
    currentInfo[2] = newAddress;

    //If name field empty
  } else if (newName != '' && newAddress == '') {
    currentInfo[1] = newName;

    //If address field empty
  } else if (newName == '' && newAddress != ''){
    currentInfo[2] = newAddress;
  } 
  res.render("pages/account", {currentInfo: currentInfo});

});

  // //Insert into table
  // var sql = "INSERT INTO isowaytion (email, name, address) VALUES ('testdummy@gmail.com', 'Hawkan', '123456')";
  // con.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });