const DB = require('../my database/mysql')
const bcryptjs = require('bcryptjs')
let creatNewUser = (user)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let check = await checkUserEmail(user.email);
            if(check){
                reject('email already used')
            }else{
                let salt = bcryptjs.genSaltSync(10);

                let data = {
                    username:user.username,
                    email:user.email,
                    password:bcryptjs.hashSync(user.password, salt)
                }
                DB.con.query("INSERT INTO users set ?", data,(error, rows)=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve('registered')
                    }
                    
                })

            }
        }catch (e){
            reject(e)

        }
    })

}

let checkUserEmail = (email)=>{
    return new Promise(((resolve, reject)=>{
        try{
             DB.con.query("select * from users where email=?",email,(error, rows)=>{
                if(error){
                    reject(error)
                }
                if(rows.length > 0){
                    resolve(true)
                }else{
                    resolve(false)
                }

             })
        }catch (e){
            reject(e)
        }
    }))
}
module.exports = {
    creatNewUser:creatNewUser
}