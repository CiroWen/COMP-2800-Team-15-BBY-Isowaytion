const pasp = require(`passport`)
const bcrypt = require(`bcrypt`)
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const localSetup = require(`passport-local`).Strategy



//once the funciont at line28 is done. the serializedUser function will be called
//conde here is repacking the userID into a smaller cookie
pasp.serializeUser(function(user, done) {
    done(null, user);
  });
  
  pasp.deserializeUser(function(user, done) {
    // user.findById(id, function(err, user) {
      //commented out since no db setup yet
      done(null, user);
    });
  // });
 
pasp.use(new GoogleStrategy({
    
    clientID: '996411687423-42cbqfeu786fqe2rrf18kqf641f7u4ea.apps.googleusercontent.com',
    //clientID you can fetch from google api
    clientSecret: `Nou6L05tKPEKYf-cV6qGVi9Q`,
    //same as line 23

    //Callback urls for google login
    //For local development
    //callbackURL: "http://localhost:1515/google/callback"

    //Hosted deployement
    callbackURL: "https://desolate-earth-77828.herokuapp.com/google/callback"
    //a redirect url after login
  },

  function(accessToken, refreshToken, profile, callbk) {
      //we can use profile info of google acc (mostly ID) to check if the user is in our db
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return callbk(err, user);
    // });
    return callbk(null,profile)
  }
  //funciont starts at line30 will be triggered once user login.
));


//Function for authenticating local sign in
//Exported into index.js
 function paspInit(pasp, getUserByEmail) {
    const auth = async function (email, password, callbk) {
        var user;
        getUserByEmail(email).then ( function (result) {
            // console.log("result from line8 in setup")
            // console.log(result)
            
            user = result // "Some User token"
            // console.log(user[0].length);
            
            return result;
        }).then(async()=>{
            console.log("After fecthing user's data from DB");
            console.log(user);
            // console.log(user[0].password);
            // console.log(user[0].email);
               console.log(password);
               
            if (user[0]==null) {
            return callbk(null, false, { message: `Account doesn't exist` })
            //return message to login.ejs
        }

        try {
                if(await bcrypt.compare(password,user[0].password)){
                // if ( user[0].password.indexOf(user[0].password) == 0 && user[0].password.indexOf(password) == 0 && user[0].password === password) {
                    //see if password matches user[0] is the user from db, and user is the user input from website
                    return callbk(null, user)
                    //return the user if the password matches
                } else {
                    return callbk(null, false, { message: `wrong password` })
                    //return message to login.ejs 
                }
            } 
        catch (e) {
            return callbk(e)
        }
        }).catch(console.log(`gg`)
        );
    }

    pasp.use(new localSetup({ usernameField: `email` },
        auth))
    pasp.serializeUser((user, callbk) => { callbk(null, user[0].email) })
    pasp.deserializeUser((id, callbk) => { callbk(null, id) })
}

module.exports = paspInit
//export the init function