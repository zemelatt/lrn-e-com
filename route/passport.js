const passport = require('passport')
const passportLocal = require("passport-local");
const loginserv = require('./loginserv')
const { login } = require('./controller');


let LocalStrategy = passportLocal.Strategy;


let initPassportLocal = ()=>{
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
    async(req, email, password, done) =>{
        try{
            let user = await loginserv.findUserByEmail(email);
            if(!user){
                return done(null, false, req.flash('errors', 'Email doesnt exist'))
            }else if(user){
                let match = await loginserv.comparePasswordUser(user, password);
                if(match == true){
                    return done(null, user, null);
                }else{
                    return done(null, false, req.flash('errors', match))
                }
            }

        }catch(err){
            return done(null, false, err)
        }
    }
    
    ))
}

passport.serializeUser((user, done)=>{
    done(null, user.id);
});
passport.deserializeUser((id, done)=>{
    loginserv.findUserById(id).then((user)=>{
        return done(null, user);
    }).catch(error=>{
        return done(error, null)
    })
});
module.exports = initPassportLocal