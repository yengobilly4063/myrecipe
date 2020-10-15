const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const {Category, validateCategory} = require("../models/categories")
const _ = require("lodash")
const admin = require("../middleware/admin")


router.get("/", async (req, res) => {
    
    try{
        const categories = await Category.find().sort({name: 1})
        res.send(categories)
    }catch(e){
        console.log(e)
        return res.status(500).send("Resource not found!!")
    }
})

router.get("/:id", async (req, res) => {

    const category = await Category.findById(req.params.id)

    if(!category) return res.status(400).send(`Category with id ${req.params.id} not found`)

    res.send(category)
})

router.post("/", [auth, admin],  async (req, res) => {
    const {error} = validateCategory(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const category = new Category(_.pick(req.body, ["name"]))

    await category.save()

    res.send(category)
})

router.put("/:id", [auth, admin],  async (req, res) => {
    const {error} = validateCategory(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const category = await Category.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true})
    if(!category) return res.status(400).send(`Category with id ${req.params.id} Not found!`)

    res.send(category)
})

router.delete("/:id", [auth, admin], async (req, res) => {
    const category = await Category.findByIdAndRemove(req.params.id)

    if(!category) return res.status(400).send(`Category with id ${req.params.id} Not found!!`)

    res.send(category)
})



module.exports = router