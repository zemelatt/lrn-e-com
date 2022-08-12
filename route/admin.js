const express = require('express')
const router = express.Router()
const request = require('../req/request')
const DB = require('../my database/mysql')
const {check, validationResult} = require('express-validator')

const bodyParser = require('body-parser')
const { render } = require('ejs')
const urlencodedParser = bodyParser.urlencoded({extended:false})

const access = require('./access')
const forUSER = access.forUsers;


router.get('', forUSER, (req, res)=>{
    var get = "select * from pages";
    DB.con.query(get, function (err, result){
        if(err) throw err;
        res.render('../views/admin/pages.ejs',{result})
    })


})
router.get('/add-page', forUSER, (req, res)=>{  
    res.render('../views/admin/add-page.ejs')
})

router.post('/add-page', forUSER, urlencodedParser, [
    check('title', 'user name cant be less than 5')
    .exists()
    .isLength({min:5}),

    check('content', 'must be at lest 4 characters')
    .exists()
    .isLength({min:4}),
],(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const alert = errors.array()
        res.render('../views/admin/add-page.ejs',{alert})
        // return res.status(422).json(errors.array())
    }else{
        var title = req.body.title
        var content = req.body.content
        var pages = "INSERT INTO pages values(null,'"+ title+"','"+ content+"')"
        DB.con.query(pages, function(err, result) {
            if (err) throw err;
            res.render('../views/admin/pages.ejs',{result})
          });

  
}}) 
router.get('/add-page/load', forUSER, (req, res)=>{
    var get = "select * from pages";
    DB.con.query(get, function (err, result){
        if(err) throw err;
        res.render('../views/admin/pages.ejs',{result})
    })  
})  
router.get('/edit-page/:id', forUSER, (req, res)=>{
    const id = req.params.id; 
    var edit = `select * from pages where id="${id}"`; 
    DB.con.query(edit, function (err, result){
        if(err) throw err;
        res.render('../views/admin/edit-page.ejs',{result}) 
    })
})
router.post('/edit-page/:id', forUSER, (req, res)=>{
    const id = req.params.id
    const title = req.body.title
    const content = req.body.content
    var edit = `UPDATE pages SET title="${title}", content="${content}", slug="${slug}" where id="${id}"`;
    DB.con.query(edit, function (err, result){
        if(err) throw err;
        res.render('../views/admin/pages.ejs',{result})
        console.log('updated')
        console.log(result)
    })
})
router.get('/delete-page/:id', forUSER, (req, res)=>{
    const id = req.params.id; 
    var deletee = `delete from pages where id="${id}"`; 
    DB.con.query(deletee, function (err, result){
        if(err) throw err;
        res.render('../views/admin/pages.ejs',{result})  
        console.log('deleted')
 
    })
})
module.exports = router