const express = require('express')
const router = express.Router()
const request = require('../req/request')
const DB = require('../my database/mysql')
const {check, validationResult} = require('express-validator')
const mkdirp = require('mkdirp')
const fs = require('fs-extra')

const bodyParser = require('body-parser')
const { render } = require('ejs')
const { json } = require('body-parser')

const urlencodedParser = bodyParser.urlencoded({extended:false})

const access = require('./access')
const forUSER= access.forUsers;


router.get('',forUSER, (req, res)=>{
    const get = 'select * from pages'
    DB.con.query(get,(err, data)=>{
        var get2 = "select * from products";
        DB.con.query(get2, (err, result2)=>{
            var get3 = "select * from catagory";
            DB.con.query(get3, (err, result)=>{
                res.render('products',{data, result, 'byc':result2, title:'Products',user:req.user});

            })

        })
    })
});

router.get('/:catagory',forUSER,(req, res)=>{
    var cat =req.params.catagory;
    var get2 = `select * from products where catagory='${cat}'`;
    DB.con.query(get2, (err, result2)=>{
        const get = 'select * from pages'
        DB.con.query(get,(err, data)=>{
            var get3 = "select * from catagory";
            DB.con.query(get3, (err, result)=>{
        var neww = JSON.stringify(result2)
        console.log(result2)
        res.render('products',{data, result, 'byc':result2, title:'Products',user:req.user});
        // res.render('by-c',{'byc':result2, result, data, title:'Products'});
            })
        })
    })

});


 module.exports = router