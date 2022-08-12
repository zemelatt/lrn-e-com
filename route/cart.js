const express = require('express');
const { createTransport } = require('nodemailer');
const router = express.Router()

const DB = require('../my database/mysql')

const access = require('./access')
const forUSER= access.forUsers;

router.get('/add/:id', forUSER,(req, res)=>{
    var backURL =req.header('Referer') || '/'      
        var id = req.params.id
        var get2 = `select * from products WHERE id='${id}'`;
        DB.con.query(get2,(err, result2)=>{

    if(err)
    console.log(err);
    if(typeof req.session.cart == "undefined"){
        req.session.cart =[];
        req.session.cart.push({
            id:id,
            title:result2[0].title,
            qty:1,
            price:result2[0].price,
            img:result2[0].img
        });
    }else{ 
        var cart = req.session.cart;
        var newItem = true;
        for(var i = 0; i<cart.length; i++){
            if(cart[i].id == id){
                cart[i].qty++;
                newItem= false;
                break;
            }
        }
        if(newItem){
            cart.push({
                id:id,
                title:result2[0].title,
                qty:1,
                price:parseFloat(result2[0].price).toFixed(2),
                img:result2[0].img
            });
        }
    }
    res.redirect('back')
})
  
});

router.get('/checkout', forUSER, (req, res)=>{
        const get = 'select * from pages'
        DB.con.query(get,(err, data)=>{
        res.render('../views/cart.ejs',{data, title:'Cart', check:req.session.cart});
    })
})

router.get('/update/:title', forUSER, (req, res)=>{
    var title = req.params.title
    var cart = req.session.cart
    var action  = req.query.action;
    for(let i=0; i < cart.length; i++){
        if(cart[i].title == title){
            switch(action){
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if(cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('update cart')
                    break;
            }
            break;
        }
    }
    res.redirect('back')
})

module.exports = router