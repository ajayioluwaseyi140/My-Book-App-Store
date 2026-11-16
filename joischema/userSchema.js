const Joi = require("joi");
const JoiPwd = require("joi-password-complexity");

//user schema
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    

});


//password complexity
const complexityOptions = {
    min: 6,
    max: 30,
    lowercase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,

};

module.exports.userVal = userSchema;
module.exports.pwdVal = JoiPwd(complexityOptions);