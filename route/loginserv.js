const DB = require('../my database/mysql')
const bcrypt = require('bcryptjs')
let findUserByEmail = (email)=>{
    return new Promise(((resolve, reject)=>{
        try{
            DB.con.query('select * from users where email=?', email,(error, rows)=>{
                if(error){
                    reject(error)
                }
                let user = rows[0];
                resolve(user)

            })

        }catch (e){
            reject(e)
        }
    }))
}
let comparePasswordUser = (user, password)=>{
    return new Promise( async(resolve, reject)=>{
        try{
            let ismatch = await bcrypt.compare(password, user.password);
            if(ismatch)
                resolve(true)
                
            resolve('Incorrect password')
        }catch(e){
            reject(e)

        }
    })
}

let findUserById = (id)=>{
    return new Promise((resolve, reject) => {
        try{
            DB.con.query('select * from users where id = ?', id,(error, rows)=>{
                if(error) reject(error);
                let user = rows[0];
                resolve(user);
            })
        }catch(e){
            reject(e)

        }
    })
}
module.exports= {
    findUserByEmail:findUserByEmail,
    comparePasswordUser:comparePasswordUser,
    findUserById:findUserById
}