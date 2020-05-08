const express = require('express')
const app = express();
      app.use(express.static('public'));
//cors is a middleware for Cross-origin resource sharing.
//is used to enable the communication between the front end and back end from diff domains
const bodyParser = require('body-parser')
const passport = require(`passport`)
const cookieSession = require('cookie-session')
const email = require(`./passport-setup`)
require(`./passport-setup`)
const mysql = require(`mysql`)



const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}


// app.use(cors())

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json());


app.use(cookieSession({
  name: 'Ciro\'s cookies',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());
app.get('/welcome', isLoggedIn, (req, res) => {
  useremail = req.user._json.email;
  res.send(`welcome ${req.user.displayName}<hr> ${req.user._json.email} `)
})
//display the return value of profile from passport-setup.js
app.get('/', (req, res) => { res.render("pages/index"); })

app.get('/failed', (req, res) => res.send('sorry you failed to login'))
app.get('/index', (req, res) => res.send(`welcome to IsoWaytion `))

// you guys can addmore router

app.get('/google', passport.authenticate('google', {
  scope: ['profile', `email`]
}));
//line above opens a google page with google login account option. just like how we normally have 
//the scope means how much info we can fetch from the user's google account info.
//!!!!!!Warning: some scopes will charge!!!!!!!!!!!!



app.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/failed'
  }),
  //authenticate() redirect to 2nd para if fail to authenticate
  function (req, res) {
    // Successful authentication, redirect too the route below
    res.redirect('/welcome');
  });


app.get('/logout', (req, res) => {
  //session means the access to our API.
  //eg. can't aceess to welcome
  req.session = null;
  //logout
  req.logout();
  //redirect to homepage
  res.redirect('/')
})



//******************************************* *********************/
//******************************************* *********************/
//******************************************* *********************/
//******************************************* *********************/
//db part starts from here
//connection for db. google `mpm mysql` for more info
const db = mysql.createConnection({
  host: '205.250.9.115',
  //where the info is hoste
  user: 'root',
  //the user name of db
  password: '123',
  //the pswd for user
  database: 'isowaytion'
  //name of db
});

//initial connection
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('db is connected');
  //ciro is connected
});



app.get(`/tabletable`, (req, res) => {
  let query1 = 'CREATE TABLE c1(Email VARCHAR(100), Name VARCHAR(100), Address VARCHAR(100), PRIMARY KEY (Email))'
  //this is mysql command/syntax. all capital letter is the db reserved syntax
  //that creates a table named c1 with fileds Email, name, and address
  db.query(query1, (err, result) => {
    if (err) {
      console.log(err.sqlMessage);
      //prompting the sql err msg
      console.log(err);
      res.send(`<p>fail to create table</p><p>db feedback:${err.sqlMessage}`)
    }
    //you can see all the err msg here. so up above err.sqlMessage is used.
    else {
      console.log(result);
      res.send(`table created`);
    }
  })
})


//simple sql query to fetch the data from db.
//here is just using the system table as a calculator.
db.query(`SELECT 1+1 AS solution`, (err, results, fileds) => {
  if (err) console.log('error');
  //
  console.log(results);
  console.log(results[0].solution);

})


//creating a user in our database.
app.get('/usercreating', (req, res) => {
  let value = {
    Email: useremail,
    Name: 'ciro',
    Address: 'metrotown'
  }
  let sql = 'INSERT INTO c1 set ?'
  let query = db.query(sql, value, (err, result) => {
    if (err) {
      console.log(`err occured ${err}`);
    } else {
      res.send('created')
    }
  })
})

db.query(`SELECT email FROM c1 WHERE Name = \"ciro\"`, (err, results) => {
  console.log(results);
  // console.log(results[0].Email);

})

// app.listen('1515', ()=>{
//     console.log('Ciro is listening again on 1515, ctrl + c to escape, visit localhost:1515 to test');

// })

app.listen(1515, () => console.log(`ciro listening on ${1515} ctrl + c to quit, visit localhost:1515 to test`))

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


var con = mysql.createConnection({
  host: "205.250.9.115",
  user: "root",
  password: "123",
  database: "isowaytion"
});

// app.listen(1515, () => console.log(`Hawkan listening on ${1515}`));

/*******************************************
 * Express server side
 */
app.use(express.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/myAccount", isLoggedIn, (req, res) => {
  useremail = req.user._json.email;
  console.log(useremail);
  con.query(`SELECT * FROM isowaytion WHERE email = '${useremail}'`, (err, rows) => { 
    if (err) throw err;

    console.log('Data received from isowaytion.');
    console.log(rows);
    //Store in user info array, {email, name, address}
    currentInfo = [rows[0].Email, rows[0].Name, rows[0].Address];

    //pass info to account page when rendered
    res.render("pages/myAccount", {
      currentInfo: currentInfo
    });
  });
});

app.post("/myAccount", (req, res) => {
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
  if (newName != '' && newAddress != '') {

    //update name and address in current info array
    currentInfo[1] = newName;
    currentInfo[2] = newAddress;

    //If name field empty
  } else if (newName != '' && newAddress == '') {
    currentInfo[1] = newName;

    //If address field empty
  } else if (newName == '' && newAddress != '') {
    currentInfo[2] = newAddress;
  }
  res.render("pages/editInfo", {
    currentInfo: currentInfo
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

app.get("/leaderboard", isLoggedIn, (req, res) => {
  useremail = useremail = req.user._json.email;

  //Grab user name
  let getName = `SELECT isowaytion.Name FROM isowaytion WHERE email = '${useremail}'`;
  con.query(getName, (err, name) => { 
    if (err) throw err;

    console.log('Data received from isowaytion.');
    console.log(name[0].Name);

    //Grab name from query
    // let username = name[0].Name;

    //Grab points info from database
    let getPoints = `SELECT * FROM reward ORDER BY reward.Points DESC;`

    con.query(getPoints, (err, leaderboardData) => {
      if (err) throw err;

      //Genereate array of leaderboard data from returned array of objects
      let leaderboard = [];
      leaderboardData.forEach(row => {
        leaderboard.push(row.Email);
        leaderboard.push(row.Points)
      });
      
      //Load leaderboard page
      res.render("pages/leaderboard", {userData: leaderboard});
    });
    
  });
});