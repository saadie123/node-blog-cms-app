const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value)=>{
                return validator.isEmail(value)
            },
            message: "{VALUE} is not a valid Email address"
        }
    },
    password:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('users',userSchema);