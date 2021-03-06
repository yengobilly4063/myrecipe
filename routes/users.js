
const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const {User, validateUser} = require("../models/users")
const _ = require("lodash")
const bcrypt = require("bcrypt")


router.post("/", async (req, res) => {
    console.log(req.body)
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const userExists = await User.findOne({email: req.body.email})
    if(userExists) res.status(400).send(`User with email ${req.body.email} already exists`)

    const user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin" ]))
    user.password = await bcrypt.hash(user.password,  10)
    
    await user.save()

    const token = user.generateAuthToken()

    res.header("x-auth-token", token).send(_.pick(user, ["_id", "name", "email"]))
})

router.get("/me", auth,  async (req, res) =>{
    const user = await User.findById(req.user._id).select("-password")
    res.send(user)
})




module.exports = router