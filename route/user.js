const express = require('express')
const router = express.Router()
const request = require('../req/request')
const DB = require('../my database/mysql')
const {check, validationResult} = require('express-validator')

const bodyParser = require('body-parser')
const { render } = require('ejs')
const urlencodedParser = bodyParser.urlencoded({extended:false})

const pages = require('./pages')
const controller = require('../route/controller')
const auth = require('../route/authValidation')
const passport = require('passport')
const initPassportLocal = require('../route/passport')
const intoAPP = require('../route/into app')

const access = require('./access')
const forUSER= access.forUsers;

initPassportLocal()
router.get('/user',controller.checkLogIn,intoAPP.home)//controller.checkLogIn,

router.get('/login',controller.checkLogOut, controller.getLoginPage);//controller.checkLogOut,
router.post('/login',passport.authenticate("local",{
    successRedirect:'/user/user',
    failureRedirect:'/user/login',
    successFlash:true,
    failureFlash:true

}) );


router.get('/register',controller.getRegisterPage);
router.post('/register', auth.validatedRegister, controller.createUser);
router.post('/logout', forUSER,controller.postLogOut)



module.exports = router