const express = require('express')
const router = express.Router()

const DB = require('../my database/mysql')

router.get('', (req, res)=>{
    const get = 'select * from pages'
    DB.con.query(get,(err, data)=>{
            res.render('../views/Home.ejs',{title:'E-commerce', data});
    })

});


module.exports = router;
