const localSetup = require(`passport-local`).Strategy

//authentication process
async function paspInit(pasp, getUserByEmail) {
    const auth = async function (email, password, callbk) {
        var user;
        getUserByEmail(email).then(function (result) {
            console.log("result from line8 in setup")
            console.log(result)
            user = result // "Some User token"
            return result;
        }).then(()=>{
            // console.log("After fecthing user's data from DB");
            // console.log(user);
            // console.log(user[0].password);
            // console.log(user[0].email);
               
        if (user[0].length==null) {
            return callbk(null, false, { message: `Account doesn't exist` })
            //return message to login.ejs
        }

        try {
            if (user[0].password) {
                if ( user[0].password.indexOf(user[0].password) == 0 || user.password[0].indexOf(password) == 0) {
                    //see if password matches user[0] is the user from db, and user is the user input from website
                    return callbk(null, user)
                    //return to user if the password matches
                } else {
                    return callbk(null, false, { message: `wrong password` })
                    //return message to login.ejs and telling input password is wrong
                }
            } else {
                return callbk(null, false, { message: `No such user` })
                //return message to login.ejs and telling input email doesnt exist.
            }
        } catch (e) {
            return callbk(e)
        }
        })
    }
    
    pasp.use(new localSetup({ usernameField: `email` },
        auth))
    pasp.serializeUser((user, callbk) => { callbk(null, user[0].email) })
    pasp.deserializeUser((id, callbk) => { callbk(null, id) })
}
module.exports = paspInit
//export the init function

