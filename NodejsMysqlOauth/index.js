const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser =require('body-parser')
const passport = require(`passport`)
const cookieSession = require('cookie-session')
require(`./passport-setup`)


const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}


// app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json());


app.use(cookieSession({
    name: 'Ciro\'s cookies',
    keys: ['key1', 'key2']
  }))

app.use(passport.initialize());
app.use(passport.session());
app.get('/welcome', isLoggedIn,(req,res)=> res.send(`welcome ${req.user.displayName}<hr>${req.user}`))
app.get('/', (req,res) => res.send('Ciro testing'))

app.get('/failed', (req,res) => res.send('sorry you failed to login'))
app.get('/index',(req,res)=> res.send(`welcome to IsoWaytion `))

// you guys can addmore router

app.get('/google', passport.authenticate('google', { scope: ['profile',`email`] }));
//line above opens a google page with google login account option. just like how we normally have 
//the scope means how much info we can fetch from the user's google account info. Warning: some scopes will charge



app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  //authenticate() redirect to 2nd para if fail to authenticate
  function(req, res) {
    // Successful authentication, redirect too the route above
    res.redirect('/welcome');
  });


  app.get('/logout', (req,res)=>{
    //session tbd
    req.session=null;
    //logout
    req.logout();
    //redirect to homepage
    res.redirect('/')
  })
  

  app.listen(1515, () => console.log(`ciro listening on ${1515}`))





