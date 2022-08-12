const {check, validationResult} = require('express-validator')
const DB = require('../my database/mysql')
const registerService = require('../route/registerService')

let getLoginPage = (req, res) =>{
    return res.render('../views/login.ejs', {title:'Log in', errors:req.flash('errors'),  user:req.user})

}
let getRegisterPage = (req, res)=>{
    return res.render('../views/register.ejs', {title:'Register', errors:req.flash('errors'),  user:req.user})
}

let createUser = async(req, res)=>{
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item)=>{
            errorsArr.push(item.msg);
        });
        req.flash('errors', errorsArr);
        return res.render('../views/register.ejs',{title:'Register', errors:req.flash('errors')})
    }
    try{
        let newUser= {
            username:req.body.username,
            email:req.body.email,
            password:req.body.password
        }
        // await registerService.creatNewUser(newUser);
        await registerService.creatNewUser(newUser);
        return res.render('../views/login.ejs',{title:'Log in', errors:req.flash('errors'), user:req.user})
    }catch (e){
        req.flash('errors', e);
        return res.render('../views/register.ejs',{title:'reg', errors:req.flash('errors')})

    }
}
let checkLogOut = (req, res, next)=>{
    if(req.isAuthenticated()){
        return res.render('../views/home-intro.ejs',{title:'Home in',user:req.user})
    }
    next();
}
let checkLogIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        return res.render('../views/login.ejs',{title:'Log in',errors:req.flash('errors'), user:req.user })
    }
    next();
}

let postLogOut = (req, res)=>{
    req.session.destroy((err)=>{
        res.render('../views/Home.ejs',{title:'Home in',user:req.user})

    })
}


module.exports = {
    getLoginPage:getLoginPage,
    getRegisterPage:getRegisterPage,
    createUser:createUser,
    checkLogIn:checkLogIn,
    checkLogOut:checkLogOut,
    postLogOut:postLogOut
}

