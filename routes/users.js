const express = require("express")
const router = express.Router()
const {User, validateUser} = require("../models/users")
const _ = require("lodash")
const bcrypt = require("bcrypt")

router.post("/", async (req, res) => {
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const userExists = await User.findOne({email: req.body.email})
    if(userExists) res.status(400).send(`User with email ${req.body.email} already exists`)

    const user = new User(_.pick(req.body, ["name", "email", "password" ]))
    user.password = await bcrypt.hash(user.password,  10)

    await user.save()

    res.send(user)
})




module.exports = router