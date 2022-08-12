const DB = require('../my database/mysql')
let home =(req, res)=>{
    const get = 'select * from pages'
    DB.con.query(get,(err, data)=>{
            res.render('../views/home-intro.ejs',{title:'E-commerce', data, user:req.user});
    })

};

module.exports ={ home:home}
