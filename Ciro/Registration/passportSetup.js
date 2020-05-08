const localSetup = require(`passport-local`).Strategy

async function paspInit(pasp,getUserByEmail){
    //function that authenticate the user
    const auth = (email,password,callbk)=>{
        const user =  getUserByEmail(email)
        console.log(user);
        
        //fetch the user from DB
        if(user ==null){
            return callbk(null,false,{message:`no such user`})
            //return message to login.ejs
        }

        try{
            if (await password.indexOf(user.password)==0&&user.password.indexOf(password)==0){
                //see if password matches
                return callbk(null,user)
                //return the user if the password matches
            }else{
                return callbk(null,false,{message:`wrong password`})
                //return message to login.ejs 
            }
        }catch(e){
            return callbk(e)
        }
        
        
        }
    
    pasp.use(new localSetup({usernameField:`email`},
    auth))
    pasp.serializeUser((user,callbk)=>{callbk(null,user.email)})
    pasp.deserializeUser((id,callbk)=>{callbk(null,id)})
}

module.exports= paspInit
//export the init function
     
