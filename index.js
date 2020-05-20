const express = require("express");
const app = express();
const url = require("url");
const polyline = require("polyline");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname + "scripts"));
app.use(express.static(__dirname + "scripts/scripts"));
var coordinates;
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require(`passport`);
const flash = require(`express-flash`);
const cookieSession = require("cookie-session");
require(`./passport-setup`);
const paspInit = require(`./passport-setup`);
const mysql = require(`mysql`);
const bcrypt = require(`bcrypt`)
var routes =[] ;
var decodedCoors = []
var coorIsSent=0;
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
    res.sendFile(path.join(__dirname + "/views/signin.html"));
  }
};
//set port
var port = process.env.PORT || 1515;

//Variable to check if user logs in with local or google account
let login;

//*******************consts/vars/lets declared above********************* */
// app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
  })
);
app.use("/", router);
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "Team Horton's cookies",
    keys: ["key1", "key2"],
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.get("/welcome", isLoggedIn, (req, res) => {
  useremail = req.user._json.email;
  
  //res.send(`welcome ${req.user.Email}`)
  // res.sendFile(`./pages/signup.html`);
  //error at line above: path must be absolute or specify root ro res.sedFile()

  con.query(
    `SELECT email FROM user WHERE email =\"${req.user._json.email}\"`,
    (dbReq, dbRes) => {
      // console.log(res);
      //console.log(dbRes[0].email);
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
          res.redirect("/map");
        });
      } else {
        res.redirect("/map");
      }
    }
  );
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
    //Set login status to google
    login = "google";
    // Successful authentication, redirect too the route below
    res.redirect("/welcome");
  }
);

app.get("/logout", (req, res) => {
  //session means the access to our API.
  //eg. can't aceess to welcome
  req.session = null;
  //logout
  req.logout();
  //redirect to homepage
  res.redirect("/signin");
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
// Ciro's local mysql for testing purpose.
const con = mysql.createConnection({
  host     : 'localhost',
  //where the info is hoste
  user     : 'root',
  //the user name of db
  password : 'isowaytion15',
  //the pswd for user
  database : 'isowaytion'
  //name of db
});

// var con = mysql.createConnection({
//   host: "205.250.9.115",
//   user: "root",
//   password: "123",
//   database: "isowaytion",
// });

// var con = mysql.createConnection({
//   host: "205.250.9.115",
//   user: "root",
//   password: "123",
//   database: "isowaytion",
// });

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
app.get(`/signup`, (req, res) => {
  res.sendFile(path.join(__dirname + "/views/signup.html"));
});

//post method handler that create a new account in Mysql
// regis with out using google
app.post(`/signup`, async (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(await bcrypt.hash(req.body.password,10));
  const password = await bcrypt.hash(req.body.password,10)
  //console.log(req.body);
  // if (req.body) {
  //   const regisInfo = {
  //     name: `${req.user._json.name}`,
  //     email: `${req.user._json.email}`,
  //   };
  if (req.body) {
    const regisInfo = {
      name: `${req.body.name}`,
      email: `${req.body.email}`,
      password:`${password}`
    };
    con.query(`INSERT INTO user SET ?`, regisInfo, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/signin");
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
  res.sendFile(path.join(__dirname + "/views/signup.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/signin.html"));
});

// Send to about us page
app.get("/aboutus", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/aboutus.html"));
});

app.get("/invalid", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/signin_invalid.html"));
});

// Send to Map page.
app.get("/map", function (req, res) {
  // con.query(`SELECT email FROM user WHERE email =\"${req.user._json.email}\"`,(dbReq,dbRes)=>{
  //   // console.log(res);
  //   console.log(dbRes[0].email);
  //   // console.log(dbRes.length);
  //   if(dbRes.length==0){
  //     //if the query returns an array with 0 length.
  //     //then we fetch the user's info and push in database.
  //     const regisInfo ={name:`${req.user._json.name}`,email:`${req.user._json.email}`}
  //     con.query(`INSERT INTO user SET ?`,regisInfo,(err,result)=>{
  //       if(err) console.log(err);
  //       console.log(result);

  //     })
  //   }
  // })
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

app.get("/myAccount", isLoggedIn, (req, res) => {
  // app.get("/myAccount", (req, res) => {
  if (login === "google") {
    useremail = req.user._json.email;
    userPic = req.user._json.picture;
  } else {
    userPic = "../Images/ryan_profile.png";
    useremail = req.user[0].email;
    console.log(useremail);
  }
  console.log("Testing this" + req.user);
  console.log(useremail);
  con.query(`SELECT * FROM user WHERE email = '${useremail}'`, (err, rows) => {
    if (err) throw err;

    console.log("Data received from isowaytion.");
    console.log(rows);
    //Store in user info array, {email, name, address}
    currentInfo = [rows[0].Email, rows[0].Name, rows[0].Address];
    profilePic = userPic;

    //pass info to account page when rendered
    res.render("pages/myAccount", {
      currentInfo: currentInfo,
      profilePic: profilePic,
    });
  });
});

//app.get("/editInfo", isLoggedIn, (req, res) => {
app.get("/editInfo", (req, res) => {
  if (login === "google") {
    useremail = req.user._json.email;
  } else {
    useremail = req.user[0].email;
  }
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
 * Isostats
 */

// Grab the users points for isostats page.
// app.get("/isostats", isLoggedIn, (req, res) => {
  app.get("/isostats", (req, res) => {
    if (login === "google") {
      useremail = req.user._json.email;
      userPic = req.user._json.picture;
    } else {
      useremail = req.user[0].email;
      userPic = "../Images/ryan_profile.png";
    }
    
    // fullName = req.user._json.name;
    console.log(useremail);
    con.query(`SELECT * FROM user WHERE email = '${useremail}'`, (err, rows) => {
      if (err) throw err;
  
      console.log("Data received from isowaytion.");
      console.log(rows);
      //Store points and number of routes taken in a variable.
      //name = fullName;
      name = rows[0].Name;
      profilePic = userPic;
      routeNum = rows[0].Name; // Name is temporary because we dont have a routeNum row.
      points = rows[0].Point;
      if (points == null) {
        points = 0;
      }
  
      //pass info to isostats page when rendered
      res.render("pages/isostats", {
        points: points,
        routeNum: routeNum,
        profilePic: profilePic,
        name: name,
      });
    });
  });


/*******************************************
 * Express server side, LEADERBOARDS
 */

app.get("/leaderboard", isLoggedIn, (req, res) => {
  // app.get("/leaderboard", (req, res) => {
  if (login === "google") {
    useremail = req.user._json.email;
  } else {
    useremail = req.user[0].email;
  }
  // //Grab user name
  // let getName = `SELECT isowaytion.Name FROM isowaytion WHERE email = '${useremail}'`;

  //Grab name from query
  // let username = name[0].Name;

  con.query(`SELECT * FROM user WHERE email = '${useremail}'`, (err, rows) => {
    if (err) throw err;

    console.log("Data received from isowaytion.");
    console.log(rows);
    //Store in user info array, {email, name, address}
    name = rows[0].Name;
    points = rows[0].Point;
    if (points == null) {
      points = 0;
    }
  });

  //Grab points info from database
  let getPoints = `SELECT user.Name, user.Point FROM user ORDER BY user.Point DESC;`;

  con.query(getPoints, (err, leaderboardData) => {
    if (err) throw err;

    //Genereate array of leaderboard data from returned array of objects
    let leaderboard = [];
    leaderboardData.forEach((row) => {
      let point = row.Point;
      if (point == null) {
        point = 0;
      }
      leaderboard.push(row.Name);
      leaderboard.push(point);
    });

    //Load leaderboard page
    res.render("pages/leaderboard", {
      userData: leaderboard,
      name: name,
      points: points,
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

/************************************
 * Local Login Functionality
 */

//paspInit() is a authentication interface connects to setup.js
//the function email is passed to setup.js after the data of user is fetched from mysql
paspInit(passport, (email) => {
  return new Promise(function (resolve, reject) {
    con.query(
      `select email, password from user where email = ?`,
      [email],
      (err, res, fields) => {
        if (err) {
          reject(err);
        } else {
          // console.log("user-----------------------------------");
          // console.log("res[0]['password']")
          // console.log(res[0])
          login = "local";
          resolve(JSON.parse(JSON.stringify(res)));
        }
      }
    );
  });
});

app.post(
  `/signin`,
  passport.authenticate(`local`, {
    successRedirect: `/map`,
    failureRedirect: `/invalid`,
    failureFlash: true,
  })
);

app.post("/mapmap", (req, res) => {
  // data from map.js
  // currently data is only first route
  // when I try to put all the route, it shows error "entity is too large"
  console.log(req.body);
  // console.log(polyline.decode(req.body.test))

  const encodedCoors = req.body.data
   routes = req.body.routes
  
  
  
  
  // encodedCoors is an array that consists of coordinates 
  // for all results of directions
  
  // let decodedCoors = []
  for(let i =0;i<encodedCoors.length;i++){
    decodedCoors.push(polyline.decode(encodedCoors[i]))
  }
  //create an array to store the decodedCoordinates

  //**************Testing purpose************** */
  // console.log(decodedCoors.length);
  // console.log(decodedCoors);
  // console.log(decodedCoors.length);
  // console.log(decodedCoors[0].length)
  // console.log(decodedCoors[0][0]);
  // console.log(decodedCoors[0][0][0]);
  // console.log(decodedCoors[1][0]);
    //**************Testing purpose************** */


  //since the decodedCoors[0]means first route and decodedCoors[0][0]
  //means the first coordinate info of first route
  //nested for-loop to insert into database.
 for(let k =0;k<decodedCoors.length;k++){
  for(let i=0;i<decodedCoors[k].length;i++){
    if(decodedCoors[k][i]){
    con.query(`select * from coordinates where lat=${decodedCoors[k][i][0]} and lng=${decodedCoors[k][i][1]}`,(err,res,fields)=>{
      if(res){
        if(res.length!=0){
            // con.query(`update coordinates set frequency = frequency+1 Where lat=${decodedCoors[k][i][0]} and lng=${decodedCoors[k][i][1]}`)
            // comment out since the search doesnt increment the frequency, upload does
        }else{
          con.query(`INSERT INTO coordinates(Lat,Lng,Frequency) VALUES(${decodedCoors[k][i][0]},${decodedCoors[k][i][1]},null)`)
        }
      }else{
        console.log(`error occured`);
      }
    })
    }
  }
 }
  res.send(decodedCoors)
//response by sending back the decoded coordinate array


  //*************Testing********* */
  // // this is paths of a route
  // let routes = new Array(req.body.data.length);
  // for (let i = 0; i < req.body.data.length; i++) {
  //   let length = req.body.data[i].length;
  //   console.log(
  //     `======================================Route ${
  //       i + 1
  //     }======================================`
  //   );
  //   routes[i] = new Array(length);
  //   for (let j = 0; j < length; j++) {
  //     routes[i][j] = polyline.decode(
  //       req.body.data[i][j]["encoded_lat_lngs"]
  //     )[0];
  //   }
  // }

  // console.log(routes);

  // res.send(routes);
  //*************Testing********* */
});


//app.get("/editInfo", isLoggedIn, (req, res) => {
  app.post("/map", (req, res) => {
    
    let time = req.body;
    console.log(time);
    });
app.post("/mapmapRoute",(req,res)=>{
  // getting the click event for each summary of route
  //req body comes from map.js
  console.log(req.body.routeChoice);
  let inputRoute = req.body.routeChoice
  let indexRoute = routes.indexOf(inputRoute)
  // //the routes from /mapmap
  // console.log(routes);
  // //decoded coordinates 
  // console.log(decodedCoors);
  console.log(indexRoute);
  console.log(decodedCoors[indexRoute].length);
  console.log(decodedCoors[indexRoute][0])  
  console.log(decodedCoors[indexRoute][0][0]);
  
  if(coorIsSent==0){
    
    // con.query()
  }
  // console.log(req.body.routes);  
})


app.post("upload",(req,res)=>{
  if(coorIsSent==0){
    for(let i =0;i<decodedCoors[indexRoute].length;i++){
      if(decodedCoors[indexRoute][i]){
        con.query(`select * from coordinates where lat=${decodedCoors[indexRoute][i][0]} and lng=${decodedCoors[indexRoute][i][1]}`,(err,res,fields)=>{
          if(res){
            if(res.length!=0){
              con.query(`update coordinates set frequency = frequency+1 Where lat=${decodedCoors[indexRoute][i][0]} and lng=${decodedCoors[indexRoute][i][1]}`)
              
          }else{
            con.query(`INSERT INTO coordinates(Lat,Lng,Frequency) VALUES(${decodedCoors[indexRoute][i][0]},${decodedCoors[indexRoute][i][1]},null)`)
          }
        }else{
          console.log(`error occured`);  
          }
        })
      }
    }
  }
})
