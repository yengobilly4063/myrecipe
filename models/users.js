const config = require("config")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50,
    }, 
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
    },
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, email: this.email, password: this.password, isAdmin: this.isAdmin}, config.get("jwtPrivateKey")) 
    return token
}

const User = mongoose.model("User", userSchema)



validateUser = (user) => {
    const userSchema = {
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
        isAdmin: Joi.string().default(false)
    }

    return Joi.validate(user, userSchema);
}


module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validateUser = validateUser;