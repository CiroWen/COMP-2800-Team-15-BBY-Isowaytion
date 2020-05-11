const express = require(`express`)
const app = express()
const paspInit = require(`./passportSetup`)
const pasp = require(`passport`)
const flash = require(`express-flash`)
const cksession = require(`cookie-session`)
const bodyParser = require('body-parser')
const mysql = require(`mysql`)
const chalk = require(`chalk`)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set(`view-engine`, `ejs`)
app.use(cksession({
    name: 'Ciro\'s cookies',
    keys: ['key1', 'key2']
}))
app.use(flash())
app.use(pasp.initialize());
app.use(pasp.session());
//setup

//server connection setup.
// const db = mysql.createConnection({
//     host: '205.250.9.115',
//     //where the info is hoste
//     user: 'root',
//     //the user name of db
//     password: '123',
//     //the pswd for user
//     database: 'isowaytion'
//     //name of db
// });

//local connection setup.
const db = mysql.createConnection({
    host     : 'localhost',
    //where the info is hoste
    user     : 'root',
    //the user name of db
    password : 'isowaytion15',
    //the pswd for user
    database : 'isowaytion'
    //name of db
  });

//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`db is ${chalk.blueBright(`connected`)}`);
});

//for testing
// db.query(`select email,password from user where email=\"1@1.com\"`, (req, res) => {
    //console.log(req);
    // //null
    // console.log(res[0]);    
    // console.log(res[0].password);
    // console.log(res[0].email);
    // console.log(res.length);
    // return res.length
// })


const getList = (queryName, queryParams) => {
    return new Promise(function (resolve, reject) {
        con.query(queries[queryName], queryParams, function (err, result, fields) {
            if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
            else reject(err);
        });
    });
};

const find = (email) => {
    return new Promise(function (resolve, reject){
    db.query(`select email, password from user where email = ?`, [email]
        , (err, res,fields) => {
            if (err) {
                reject(err)
            } else {
                console.log("user-----------------------------------");
                console.log("res[0]['password']")
                console.log(res[0])
                resolve(JSON.parse(JSON.stringify(res)))
                // foundusr = JSON.stringify(res[0]["password"]);
                // return res;
            }
        })
    })

}

//paspInit() is a authentication interface connects to setup.js
//the function email is passed to setup.js after the data of user is fetched from mysql
paspInit(pasp,  (email) => {
    return new Promise(function (resolve, reject){
    db.query(`select email, password from user where email = ?`, [email]
        , (err, res,fields) => {
            if (err) {
                reject(err)
            } else {
                // console.log("user-----------------------------------");
                // console.log("res[0]['password']")
                // console.log(res[0])
                resolve(JSON.parse(JSON.stringify(res)))
            }
        })
    })
})

// function for authentication purpose.
//e.g: app.get(`/routeA`,isLoggedIn,(req,res)=>{}). Then /routeA can't be accessed without login
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        // if(req.isAuthenticated)
        next();
    } else {
        res.send(`<h1>Please login first`)
        res.sendStatus(401);
    }
}


app.get(`/`, (req, res) => {
    console.log(`Uses's email: ${chalk.blueBright(req.user)} is loaded on \`/\``);
    console.log(`Uses's current authentiaceted status: ${chalk.blueBright(req.isAuthenticated())}`);
    if(req.user){
        res.render(`index.ejs`,{c1:`${req.user}`})
    }
    res.send("loaded")

})
//page for login
app.get(`/login`, (req, res) => {
    res.render(`login.ejs`)
})

//page for registration
app.get(`/regis`, (req, res) => {
    res.render(`regis.ejs`)
})

//authtication testing page
app.get(`/authpage`, isLoggedIn, (req, res) => {
    res.send(`hello ${req.body.name}`)

})

//post method handler of /login using `local`Strategy of passport.js
app.post(`/login`, pasp.authenticate(`local`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    failureFlash: true
}))


//post method handler that create a new account in Mysql
app.post(`/regis`, (req, res) => {
    // console.log(req.body.name);
    // console.log(req.body.email);
    // console.log(req.body.password);
    // console.log(req.body);
    if(req.body){
        db.query(`INSERT INTO user SET ?`,req.body,(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.redirect(`/login`)
        })
    }
    
})

//logout function
app.get('/logout', (req, res) => {
    //session means the access to our API.
    //eg. can't aceess to welcome
    req.session = null;
    //logout
    req.logout();
    //redirect to homepage
    res.redirect('/')
})


const port = 1515
app.listen(port, () => {
    console.log(`Ciro testing on ${chalk.blueBright(port)}`);
})