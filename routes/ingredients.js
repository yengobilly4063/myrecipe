const auth = require("../middleware/auth")
const express = require("express")
const router = express.Router()
const {Ingredient, validateIngredient} = require("../models/ingredients")
const _ = require("lodash")
const { response } = require("express")

router.get("/", async (req, res) => {
    
    try{
        const ingredients = await Ingredient.find().sort({name: 1})
        res.send(ingredients)
    }catch(e){
        console.log(e)
        return res.status(500).send("Resource not found!!")
    }
})

router.get("/:id", async (req, res) => {

    const ingredient = await Ingredient.findById(req.params.id)

    if(!ingredient) return res.status(400).send(`Ingredient with id ${req.params.id} not found`)

    res.send(ingredient)
})

router.post("/", auth,  async (req, res) => {
    

    const {error} = validateIngredient(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const ingredient = new Ingredient(_.pick(req.body, ["name", "quantity", "comments"]))

    await ingredient.save()

    res.send(ingredient)
})

router.put("/:id", auth,  async (req, res) => {
    const {error} = validateIngredient(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, quantity, comments} = _.pick(req.body, ["name", "quantity", "comments"])

    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, {name, quantity, comments }, {new: true})

    if(!ingredient) return res.status(400).send(`Category with id ${req.params.id} Not found!`)

    res.send(ingredient)
})

router.delete("/:id", auth,  async (req, res) => {
    const ingredient = await Ingredient.findByIdAndRemove(req.params.id)

    if(!ingredient) return res.status(400).send(`Ingredient with id ${req.params.id} Not found!!`)

    res.send(ingredient)
})


module.exports = router