const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const session = require('express-session')
const fileupload = require('express-fileupload')
const DB = require('./my database/mysql')
var MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser')
const connectFlash = require('connect-flash')
const passport =require('passport')
const port = 2000;




DB.con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database");
});



var sessionStore = new MySQLStore({
  expiration: 10800000,
  createDatabaseTable: false,
  schema:{
    tableName: 'sessiontb1',
    columnNames:{
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
},sessionStore);
app.use(session({
  key: 'keyin',
  secret: 'my secret',
  // store: 'sessionStore',
  resave: true, 
  saveUninitialized: false,
  cookie:{
    maxAge: 1000 *60 * 60 * 24
  },
}));
 

const urlencodedParser = bodyParser.urlencoded({extended:false})
app.set('view engine', 'ejs');
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('views'))




app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// uploader
app.use(fileupload());
app.use(connectFlash())

app.get('*', function(req,res,next){
  res.locals.cart = req.session.cart;
  //res.locals.user = req.user || null;
  next();
})
app.use(passport.initialize())
app.use(passport.session())



const adminPages = require('./route/admin')
const admin_catagory = require('./route/admin-catagory')
const admin_products = require('./route/admin-products')
const e = require('express')
const userproduct = require('./route/products')
const cart = require('./route/cart')
const users = require('./route/user')
const pages = require('./route/pages')

app.use('/',pages)

app.use('/admin-catagory', admin_catagory)
app.use('/admin-products', admin_products)
app.use('/admin/pages',adminPages)

app.use('/cart',cart)
app.use('/products', userproduct)
app.use('/user', users)



app.listen(port, ()=>{
    console.log('running on ' + port)
})