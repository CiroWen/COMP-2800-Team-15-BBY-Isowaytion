const express = require("express");
const app = express();
const url = require("url");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname + "scripts"));
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require(`passport`);
const cookieSession = require("cookie-session");
require(`./passport-setup`);
const mysql = require(`mysql`);
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
//set port
var port = process.env.PORT || 1515;

//*******************consts/vars/lets declared above********************* */
// app.use(cors())
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/", router);
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "Ciro's cookies",
    keys: ["key1", "key2"],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/welcome", isLoggedIn, (req, res) => {
  res.redirect(
    url.format({
      pathname: "/myAccount",
      query: {
        req: req.user,
      },
    })
  );
  // res.send(`welcome ${req.user.displayName}`);
  // res.sendFile(`./pages/signup.html`);
  //error at line above: path must be absolute or specify root ro res.sedFile()
});

app.get("/failed", (req, res) => res.send("sorry you failed to login"));
app.get("/index", (req, res) => res.send(`welcome to IsoWaytion `));
app.post(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", `email`],
  })
);

// you guys can addmore router
app.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", `email`],
  })
);

//line above opens a google page with google login account option. just like how we normally have
//the scope means how much info we can fetch from the user's google account info.
//!!!!!!Warning: some scopes will charge!!!!!!!!!!!!

app.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  //authenticate() redirect to 2nd para if fail to authenticate
  function (req, res) {
    // Successful authentication, redirect too the route below
    res.redirect("/map");
  }
);

app.get("/logout", (req, res) => {
  //session means the access to our API.
  //eg. can't aceess to welcome
  req.session = null;
  //logout
  req.logout();
  //redirect to homepage
  res.redirect("/");
});

//******************************************* *********************/
//******************************************* *********************/
//******************************************* *********************/
//******************************************* *********************/
//db part starts from here
//connection for db. google `mpm mysql` for more info

// app.get(`/tabletable`, (req, res) => {
//   let query1 = 'CREATE TABLE c1(Email VARCHAR(100), Name VARCHAR(100), Address VARCHAR(100), PRIMARY KEY (Email))'
//   //this is mysql command/syntax. all capital letter is the db reserved syntax
//   //that creates a table named c1 with fileds Email, name, and address

//   db.query(query1, (err, result) => {
//     if (err) {
//       console.log(err.sqlMessage);
//       //prompting the sql err msg
//       console.log(err);
//       res.send(`<p>fail to create table</p><p>db feedback:${err.sqlMessage}`)
//     }
//     //you can see all the err msg here. so up above err.sqlMessage is used.
//     else {
//       console.log(result);
//       res.send(`table created`);
//     }
//   })
// })

//simple sql query to fetch the data from db.
// //here is just using the system table as a calculator.
// db.query(`SELECT 1+1 AS solution`, (err, results, fileds) => {
//   if (err) console.log('error');
//   console.log(results);
//   console.log(results[0].solution);
// })

//creating a user in our database.
//just for testing and demo purpose
app.get("/usercreating", (req, res) => {
  let value = {
    Email: useremail,
    Name: "ciro",
    Address: "metrotown",
  };
  let sql = "INSERT INTO c1 set ?";
  let query = db.query(sql, value, (err, result) => {
    if (err) {
      console.log(`err occured ${err}`);
    } else {
      res.send("created");
    }
  });
});

app.listen(port, () =>
  console.log(
    `ciro listening on ${port} ctrl + c to quit, visit localhost:${port} to test`
  )
);

/*********************************************************************************************************************************************
 * Account Page Server JS
 */
//Lenght of info array
const LENGTH = 3;

//Current user info, array
let currentInfo = new Array(LENGTH);

/******************************************
 * Accessing user database
 */

//**************05-11 edit************************
//Ciro's local mysql for testing purpose.
// const con = mysql.createConnection({
//   host     : 'localhost',
//   //where the info is hoste
//   user     : 'root',
//   //the user name of db
//   password : 'isowaytion15',
//   //the pswd for user
//   database : 'isowaytion'
//   //name of db
// });

var con = mysql.createConnection({
  host: "205.250.9.115",
  user: "root",
  password: "123",
  database: "isowaytion",
});

// initial connection
con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("db is connected");
  //ciro is connected
});

// testing
// con.query(`SELECT email FROM user WHERE email =\"${req.user._json.email}`,(req,res)=>{
//   // console.log(res);
//   console.log(res[0]);
//   console.log(res[0].Email);
// })

// app.listen(1515, () => console.log(`Hawkan listening on ${1515}`));

/*******************************************
 * Express server side
 */
app.get(`/regis`, (req, res) => {
  res.render(`pages/regis.ejs`);
});

//post method handler that create a new account in Mysql
// regis with out using google
app.post(`/regis`, (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body);
  if (req.body) {
    con.query(`INSERT INTO user SET ?`, req.body, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect(`/`);
    });
  }
});

// Temporary google login, catching the post request from sign in page
// Works for signin and google button
app.post("/google", (req, res) => {
  //log below is for memo
  // console.log(req.user._json);
  // console.log(req.user._json.name);
  // console.log(req.user._json.picture);
  //google profle pic
  // console.log(req.user._json.email);
  if (req.user) {
    const regisInfo = {
      name: `${req.user._json.name}`,
      email: `${req.user._json.email}`,
    };
    //generates a JSON that contains user info.
    // console.log(regisInfo);
    //create user using google's info in our db
    if (req.user._json.email_verified) {
      con.query(`INSERT INTO user SET ?`, regisInfo, (err, result) => {
        if (err) console.log(err);
        // console.log(result);
        res.redirect(`/map`);
      });
    }
  } else {
    res.redirect(`/google`);
  }
});

//************05-11 edit ends ****************
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/signin.html"));
});

// Send to isostats page
app.get("/isostats", (req, res) => {
  res.render("pages/isostats");
});

// Send to about us page
app.get("/aboutus", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/aboutus.html"));
});

// Send to Map page.
app.get("/map", function (req, res) {
  con.query(
    `SELECT email FROM user WHERE email =\"${req.user._json.email}\"`,
    (dbReq, dbRes) => {
      // console.log(res);
      console.log(dbRes[0].email);
      // console.log(dbRes.length);
      if (dbRes.length == 0) {
        //if the query returns an array with 0 length.
        //then we fetch the user's info and push in database.
        const regisInfo = {
          name: `${req.user._json.name}`,
          email: `${req.user._json.email}`,
        };
        con.query(`INSERT INTO user SET ?`, regisInfo, (err, result) => {
          if (err) console.log(err);
          console.log(result);
        });
      }
    }
  );
  //   {
  //   //log below is for memo
  //   // console.log(req.user._json);
  //   // console.log(req.user._json.name);
  //   // console.log(req.user._json.picture);
  //   //google profle pic
  //   // console.log(req.user._json.email);
  //   if(req.user){
  //     const regisInfo ={name:`${req.user._json.name}`,email:`${req.user._json.email}`}
  //     //generates a JSON that contains user info.
  //     // console.log(regisInfo);
  //     //create user using google's info in our db
  //     if(req.user._json.email_verified){
  //       con.query(`INSERT INTO user SET ?`,regisInfo,(err,result)=>{
  //         if(err) console.log(err);
  //         // console.log(result);
  //         res.redirect(`/map`)
  //       })
  //     }
  //   }else{
  //     res.redirect(`/google`);
  // }
  // }
  res.sendFile(path.join(__dirname + "/views/map.html"));
});

// Add the router
app.use(express.static(__dirname + "/view"));
//Store all HTML files in view folder.
app.use(express.static(__dirname + "/script"));
//Store all JS and CSS in Scripts folder.

// app.get("/myAccount", isLoggedIn, (req, res) => {
app.get("/myAccount", (req, res) => {
  useremail = req.user._json.email;
  console.log(useremail);
  con.query(`SELECT * FROM user WHERE email = '${useremail}'`, (err, rows) => {
    if (err) throw err;

    console.log("Data received from isowaytion.");
    console.log(rows);
    //Store in user info array, {email, name, address}
    currentInfo = [rows[0].Email, rows[0].Name, rows[0].Address];

    //pass info to account page when rendered
    res.render("pages/myAccount", {
      currentInfo: currentInfo,
    });
  });
});

//app.get("/editInfo", isLoggedIn, (req, res) => {
app.get("/editInfo", (req, res) => {
  useremail = req.user._json.email;
  console.log("This is the email" + useremail);
  con.query(`SELECT * FROM user WHERE email = '${useremail}'`, (err, rows) => {
    if (err) throw err;

    console.log("Data received from isowaytion.");
    console.log(rows);
    //Store in user info array, {email, name, address}
    currentInfo = [rows[0].Email, rows[0].Name, rows[0].Address];

    //pass info to edit info page when rendered
    res.render("pages/editInfo", {
      currentInfo: currentInfo,
    });
  });
});

app.post("/editInfo", (req, res) => {
  let userData = req.body;
  console.log(userData);
  let newName = userData.username;
  let newAddress = userData.address;

  console.log(newName);
  console.log(newAddress);

  //Update name field
  if (newName != "" && newName != undefined) {
    var sql = `UPDATE user SET name = '${newName}' WHERE email = '${currentInfo[0]}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  }

  //Update address field
  if (newAddress != "" && newAddress != undefined) {
    var sql = `UPDATE user SET address = '${newAddress}' WHERE email = '${currentInfo[0]}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  }

  //Show updated info
  if (
    newName != "" &&
    newAddress != "" &&
    newName != undefined &&
    newAddress != undefined
  ) {
    //update name and address in current info array
    currentInfo[1] = newName;
    currentInfo[2] = newAddress;

    //If address field empty
  } else if (
    newName != "" &&
    newName != undefined &&
    (newAddress == "" || newAddress == undefined)
  ) {
    currentInfo[1] = newName;

    //If name field empty
  } else if (
    (newName == "" || newName == undefined) &&
    newAddress != "" &&
    newAddress != undefined
  ) {
    currentInfo[2] = newAddress;
  }
  res.render("pages/editInfo", {
    currentInfo: currentInfo,
  });
});

// //Insert into table
// var sql = "INSERT INTO isowaytion (email, name, address) VALUES ('testdummy@gmail.com', 'Hawkan', '123456')";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("1 record inserted");
// });

/*******************************************
 * Express server side, LEADERBOARDS
 */

//app.get("/leaderboard", isLoggedIn, (req, res) => {
app.get("/leaderboard", (req, res) => {
  useremail = useremail = req.user._json.email;

  // //Grab user name
  // let getName = `SELECT isowaytion.Name FROM isowaytion WHERE email = '${useremail}'`;

  //Grab name from query
  // let username = name[0].Name;

  //Grab points info from database
  let getPoints = `SELECT * FROM reward ORDER BY reward.Points DESC;`;

  con.query(getPoints, (err, leaderboardData) => {
    if (err) throw err;

    //Genereate array of leaderboard data from returned array of objects
    let leaderboard = [];
    leaderboardData.forEach((row) => {
      leaderboard.push(row.Email);
      leaderboard.push(row.Points);
    });

    //Load leaderboard page
    res.render("pages/leaderboard", {
      userData: leaderboard,
    });
  });
});

// // Check mySQL for corrent information
app.post("/auth", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});
