const pasp = require(`passport`)

const GoogleStrategy = require('passport-google-oauth20').Strategy;



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
    // callbackURL: "http://localhost:1515/google/callback"
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