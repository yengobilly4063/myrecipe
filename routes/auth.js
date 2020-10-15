
const express = require("express")
const router = express.Router()
const {User} = require("../models/users")
const _ = require("lodash")
const bcrypt = require("bcrypt")
const Joi = require("joi")

router.post("/", async (req, res) => {
    const {error} = validateUserLoginInfo(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({email: req.body.email})
    if(!user) res.status(400).send(`Invalid email`)

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if(!isValidPassword) res.status(400).send(`Invalid password`)


    const token = user.generateAuthToken()

    res.send(token)
})

validateUserLoginInfo = (user) => {
  
    const loginSchema = {
        email: Joi.string().required().email().min(5).max(255),
        password: Joi.string().required().min(8).max(255),
    }

    return Joi.validate(user, loginSchema);
}



module.exports = router