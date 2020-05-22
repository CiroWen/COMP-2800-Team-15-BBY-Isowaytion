const express = require("express");
//robust routing library
const app = express();
//setup app for convenient purpose
const url = require("url");
//TBD
const polyline = require("polyline");
//library that provides polylineDecode
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
const bcrypt = require(`bcrypt`);
var routes = [];
//array to store route information

var decodedCoors = [];
//array to store decored Coordinates

var indexRoute = 0;
// to store currently chosen route by user, to determine which set of coordinates will be processed in our database.

var timeOfDept;
//the time of depature, format: 00:00

var durationTime;
//the expected duration time from Google to finish the route.

var port = process.env.PORT || 1515;
//set port

let login;
//Variable to check if user logs in with local or google account

/**
 * 
 * @param {*} req reqeust info of user
 * @param {*} res response process
 * @param {*} next process next yeild statement in Google's generator function
 */
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    //if req.user is defined
    next();
    //continue to preocess
  } else {
    res.sendStatus(401);
    //error status msg
    res.sendFile(path.join(__dirname + "/views/signin.html"));
    //redirect to signin page if login is failed.
  }
};

//TBD
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
//set the page renderer to view and preprocessor ejs.

//TBD
app.use(
  cookieSession({
    name: "Team Horton's cookies",
    keys: ["key1", "key2"],
  })
);
app.use(flash());

app.use(passport.initialize());
//initialize the passport setup
app.use(passport.session());
//TBD


/**
 * When /welcome is visited.
 */
app.get("/welcome", isLoggedIn, (req, res) => {
  useremail = req.user._json.email;
  //get the email of user by accesing Google's returned email value

  //generate the user with their name and email in database.
  con.query(
    `SELECT email FROM user WHERE email =\"${req.user._json.email}\"`,
    (dbReq, dbRes) => {
      if (dbRes.length == 0) {
        //if the response from mySql is empty. which means it's a new user

        //JSON formating
        const regisInfo = {
          name: `${req.user._json.name}`,
          email: `${req.user._json.email}`,
        };

        //create a new record for new user in database
        con.query(`INSERT INTO user SET ?`, regisInfo, (err, result) => {
          if (err) {
            console.log(err);
          }

          res.redirect("/map");
          //redirect the user to the map page
        });
      } else {
        res.redirect("/map");
        //redirect the user to the map page
      }
    }
  );
});

// TBD (We can clean it?)
app.get("/failed", (req, res) => res.send("sorry you failed to login"));
app.get("/index", (req, res) => res.send(`welcome to IsoWaytion `));
// TBD (We can clean it?)

// process the post method from /google TBD
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
  console.log(await bcrypt.hash(req.body.password, 10));
  const password = await bcrypt.hash(req.body.password, 10);
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
      password: `${password}`,
    };
    con.query(`INSERT INTO user SET ?`, regisInfo, (err, result) => {
      if (err) {
        res.redirect("/invalid_signup");
      } else {
        console.log(result);
        res.redirect("/signin");
      }
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

app.get("/invalid_signup", function (req, res) {
  res.sendFile(path.join(__dirname + "/views/signup_invalid.html"));
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


// data from map.js
  // currently data is only first route
  // when I try to put all the route, it shows error "entity is too large"ee
  //TBD
app.post("/mapmap", (req, res) => {
  const encodedCoors = req.body.data;
  routes = req.body.routes;
  let frequencyArr=[]
  console.log(`mapmaphere`);
  
  

  for (let i = 0; i < encodedCoors.length; i++) {
    decodedCoors.push(polyline.decode(encodedCoors[i]));
  }

  for (let k = 0; k < decodedCoors.length; k++) {
    for (let i = 0; i < decodedCoors[k].length; i++) {
      if (decodedCoors[k][i]) {
        con.query(
          `select * from coordinates where lat=${decodedCoors[k][i][0]} and lng=${decodedCoors[k][i][1]}`,
          (err, res, fields) => {
            

            if (res) {
              if (res[0]) {
                frequencyArr.push(res[0].Frequency)                 
                decodedCoors
              } else {
                con.query(
                  `INSERT INTO coordinates(Lat,Lng,Frequency) VALUES(${decodedCoors[k][i][0]},${decodedCoors[k][i][1]},1)`
                );
              }
            } else {
              console.log(`error occured`);

            }
          }
        );
      }
    }
  }
  
  
  
  res.send(decodedCoors);
  //response by sending back the decoded coordinate array
});

  //where the user click on direction.
  // getting the click event for each summary of route
  //then store them to the global variable in index.js -->
  //req body comes from map.js
app.post("/mapmapRoute", (req, res) => {
  let inputRoute = req.body.routeChoice;
  indexRoute = routes.indexOf(inputRoute);
 
  durationTime=req.body.routeTime
  console.log(durationTime);
});

//post maptime triggered once the submit button is clicked.
app.post("/maptime", (req, res) => {
  timeOfDept = req.body.timeData
  //time info of depature time input from map.js
  let t = new Date();
  //generates a Date object.
  let year = t.getFullYear();
  //gets the current year: 2020
  let month = t.getMonth()+1;
  //gets the current month:5, getMonth returns 0 for Jan.

  let date = t.getDate();
  //gets current date :22

  let durationMin;
  //google expected duration time converted in minute unit.
  let durationArr = [];
  //an array to process the String of duration time from Goggle e.g.1 hours 2 mins
  let inputMin=0;
  //user input converted in minute unit
  let inputArr= []
  //an array to process the String of departure time from User's input
  let scheduleHr=0;
  //schedule hour for database event setup, indicates when the user will finish the route
  let scheduleMin=0
  //sechedule minute for databse event setup
  let scheduleOverflow=0;
  // if the shchedule time extend to second day

  let 
  //fetching the useremail to assign point
  if (login === "google") {
    useremail = req.user._json.email;
  } else {
    useremail = req.user[0].email;
  }
  console.log(req.body);
  console.log(durationTime);
  
  
  //to see if both user's input and google durationTime are defined
  if(req.body&&durationTime){
    durationArr=durationTime.split(" ");
    //convert the duration time into array. e.g 1 hours --> [[1],[hours]]

    inputArr=timeOfDept.split(":");
    //convert the user input into array. e.g. 03:05 --> [[03],[05]]

    inputMin = parseInt(inputArr[0])*60+parseInt(inputArr[1])
    //parse the String input into Integer to calculate

    //deal with different cases
    if(durationArr.length==2&&durationArr[1] ==`mins`||durationArr[1]=='min'){
        //case duration time less that 1 hour
        durationMin =parseInt(durationArr[0])

    }else if(durationArr.length==2&&durationArr[1] =='hr'||durationArr[1]==`hrs`){
      //case duration time has only hour
      durationMin=parseInt(durationArr[0]*60)

    }else if (durationArr.length==4){
      //case duration time has both hour and minute
      durationMin =parseInt(durationArr[2])+parseInt(durationArr[0])*60
    }

    scheduleMin = durationMin+inputMin
    //assign the sum of duration minutes and input minutes to scheduleMin
    //for furthuer database event time assignment

    //processing the schedule minutes
    //when schedule minute is greater than 60, carry in to schedule hour
    //when schedule hour is greater than 60, carry in to date
    while(scheduleMin>=60){
      scheduleHr++;
      scheduleMin=scheduleMin-60;
      if(scheduleHr>=60){
        date++;
        scheduleHr=scheduleHr-60
      }
    }
    // console.log(coordIsSent);
    //Mysql query assigns point to the user who submits their schedule
    con.query(`UPDATE user SET Point = Point+1 WHERE Email="${useremail}`,(err,res)=>{
      if(err){
        console.log(err);
      }
      if(res){
        console.log(res);
      }
    })
    // console.log(coordIsSent);
    
    //coordinates haven't beed sent
    // if (coorIsSent == 0) {
      //traveres all the latitudes and longtitude.
      for (let i = 0; i < decodedCoors[indexRoute].length; i++) {
        if (decodedCoors[indexRoute][i]) {
          //if the coordinate exists

          /**
           * run the select query to check if such coordinates in the database.
           * if so, assign a event to increse the frequency indicating there is one more user is walking on the route
           * and another event to decrese the frequency when their route is finished.
           * if not, put all coordinated in the chosen route into database with default frequency 1
           */
            con.query(
              `select * from coordinates where lat=${decodedCoors[indexRoute][i][0]} and lng=${decodedCoors[indexRoute][i][1]}`,
                (err, res, fields) => {
                  console.log(`first query returns`);
                  
                  if (res) {
                    if (res.length != 0) {
                      
                      con.query(`CREATE EVENT isowaytion.${makeEventName(6)}
                      ON SCHEDULE AT "${year}-${month}-${date} ${timeOfDept}:00"
                      DO UPDATE coordinates set Frequency = Frequency+1 Where Lat=${decodedCoors[indexRoute][i][0]} and Lng=${decodedCoors[indexRoute][i][1]}`)
                      
                      console.log(`mid of events`);
                      con.query(`CREATE EVENT isowaytion.${makeEventName(5)}
                      ON SCHEDULE AT "${year}-${month}-${date} ${scheduleHr}:${scheduleMin}:00"
                      DO UPDATE coordinates set Frequency = Frequency-1 Where Lat=${decodedCoors[indexRoute][i][0]} and Lng=${decodedCoors[indexRoute][i][1]}`)
                      // coorIsSent=1;
                    } else {
                      console.log(`elsehere`);
                      
                      con.query(
                        `INSERT INTO coordinates(Lat,Lng,Frequency) VALUES(${decodedCoors[indexRoute][i][0]},${decodedCoors[indexRoute][i][1]},1)`
                      );
                      // coorIsSent=1;
                    }
                  } else {
                    console.log(`error occured`);
                  }
                }
              );
            }
          }
        // } //coorissent bracket
    

  }
});


/**
 * a function that makes ramdom String for event initializing purporse
 * @param {*} length length for randomized String
 */
function makeEventName(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


//setting the port to be listened when index.js in run
app.listen(port, () =>
  console.log(
    `Thank you for testing IsoWaytion. ctrl + c to quit, visit localhost:${port} to test`
  )
);