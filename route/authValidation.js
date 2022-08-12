const {check, validationResult} = require('express-validator')

let validatedRegister = [
    check('username',"name should not be empty !")
    .exists()
    .isLength({min:6}),
    check('email', 'invalid email !')
    .exists()
    .isLength({min:5}),
    check('password', 'password should not be empty !')
    .exists()
    .isLength({min:4}),
    check('ConfirmPassword', 'password confirmation does not match password !')
    .exists()
    .custom( (value, {req})=>{
        return value === req.body.password
    })
];

module.exports = {
    validatedRegister:validatedRegister
}