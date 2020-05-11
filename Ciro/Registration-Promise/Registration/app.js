const express = require(`express`)
const app = express()
const paspInit = require(`./passportSetup`)
const pasp = require(`passport`)
const flash = require(`express-flash`)
const cksession = require(`cookie-session`)
const bodyParser =require('body-parser')

paspInit(pasp,email =>
    users.find(user=>user.email == email)
)
//initialized the funcion in passport-setup. and passin the email.


var users =[]
//temp fake db -- an array to store users


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.set(`view-engine`,`ejs`)
app.use(cksession({
    name: 'Ciro\'s cookies',
    keys: ['key1', 'key2']
  }))
app.use(flash())
app.use(pasp.initialize());
app.use(pasp.session());


const isLoggedIn = (req, res, next) => {
    if (req.user) {
        // if(req.isAuthenticated)
        next();
    } else {
        res.send(`<h1>Please login first`)
        res.sendStatus(401);
    }
  }

app.get(`/`,(req,res)=>{
    // res.render(`index.ejs`,{c1:`User`})
    console.log(req.user);
    console.log(req.isAuthenticated());
    
})

app.get(`/login`,(req,res)=>{
    res.render(`login.ejs`)
})

app.get(`/regis`,(req,res)=>{
    res.render(`regis.ejs`)
})

var users =[];
//temp fake db -- an array to store users

app.get(`/authpage`,isLoggedIn,(req,res)=>{
    res.send(`hello ${req.user}`)
    
})

app.post(`/login`,pasp.authenticate(`local`,{ 
    successRedirect:`/`,
    failureRedirect:`/login`,
    failureFlash:true
}))

app.post(`/regis`,(req,res)=>{
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.password);
    users.push({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    console.log(users);    
    res.redirect(`/login`)
})

app.get('/logout', (req,res)=>{
    //session means the access to our API.
    //eg. can't aceess to welcome
    req.session=null;
    //logout
    req.logout();
    //redirect to homepage
    res.redirect('/')
  })

app.listen(9999,()=>{
    console.log('Ciro testing');
    
})