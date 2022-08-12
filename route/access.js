let forUsers = (req, res, next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
         req.flash('errors','log in first')
        res.render('../views/login.ejs',{title:'Log in',errors:req.flash('errors'), user:req.user});
    }

}
module.exports = {forUsers:forUsers}
