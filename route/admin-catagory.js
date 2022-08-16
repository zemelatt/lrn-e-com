const express = require('express')
const router = express.Router()
const request = require('../req/request')
const DB = require('../my database/mysql')
const {check, validationResult} = require('express-validator')

const bodyParser = require('body-parser')
const { render } = require('ejs')
const urlencodedParser = bodyParser.urlencoded({extended:false})

const access = require('./access')
const forUSER= access.forUsers;

router.get('', forUSER, (req, res)=>{
    var get = "select * from catagory";
    DB.con.query(get, function (err, result){
        if(err) throw err;
        res.render('../views/admin/catagory.ejs',{result})
    })
})
router.get('/add-catagory', forUSER, (req, res)=>{  
    res.render('../views/admin/add-catagory.ejs')
})

router.post('/add-catagory', urlencodedParser, [
    check('title', 'user name cant be less than 5')
    .exists()
    .isLength({min:5}),

],(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
        res.render('../views/admin/add-catagory.ejs',{alert})
        // return res.status(422).json(errors.array())
    }else{
        var title = req.body.title
        var catagory = "INSERT INTO catagory values(null,'"+ title+"')"
        DB.con.query(catagory, function(err, result) {
            if (err) throw err;
            res.render('../views/admin/catagory.ejs',{result})
          });

  
}}) 
router.get('/load', forUSER, (req, res)=>{
    var get = "select * from catagory";
    DB.con.query(get, function (err, result){
        if(err) throw err;
        res.render('../views/admin/catagory.ejs',{result})
    })  
})  
router.get('/edit-catagory/:id', forUSER, (req, res)=>{
    const id = req.params.id; 
    var edit = `select * from catagory where id="${id}"`; 
    DB.con.query(edit, function (err, result){
        if(err) throw err;
        res.render('../views/admin/edit-catagory.ejs',{result}) 
    })
})
router.post('/edit-catagory/:id', forUSER, (req, res)=>{

    const title = req.body.title
    const id = req.params.id
    var edit = `UPDATE catagory SET title="${title}" where id="${id}"`;
    DB.con.query(edit, function (err, result){
        if(err) throw err;
        res.render('../views/admin/catagory.ejs',{result})
    })
})
router.get('/delete-catagory/:id', forUSER, (req, res)=>{
    const id = req.params.id; 
    var deletee = `delete from catagory where id="${id}"`; 
    DB.con.query(deletee, function (err, result){
        if(err) throw err;
        res.render('../views/admin/catagory.ejs',{result})  
        console.log('deleted')
 
    })
})
module.exports = router