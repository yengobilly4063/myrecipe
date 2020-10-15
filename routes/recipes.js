
const Fawn = require("fawn")
const express = require("express")
const router = express.Router()
const {Recipe, validateRecipe} = require("../models/recipes")
const {Ingredient} = require("../models/ingredients")
const {Category} = require("../models/categories")
const _ = require("lodash")
const mongoose = require("mongoose")
const upload = require("../services/imageUpload")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

Fawn.init(mongoose)

router.get("/", async (req, res) => {
    const recipe = await Recipe.find().sort("name")
    res.send(recipe)
})

router.get("/:id", async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    if(!recipe) return res.status(400).send(`No Recipe with id ${req.params.id} found!`)

    return res.send(recipe)
})

router.post("/", auth, upload.single("recipeImage"),  async (req, res) => {
    console.log(req.body)
    
    const {error} = validateRecipe(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, description, instructions, nutritionalInfo, ingredientId, categoryId } = req.body
    if(req.file) recipeImage = req.file.path
    

    const ingredients = await Ingredient.findById(req.body.ingredientId)
    if(!ingredients) res.status(400).send(`No ingredient with id ${ingredientId} found!`)

    const categories = await Category.findById(req.body.categoryId)
    if(!categories) res.status(400).send(`No Category with id ${categoryId} found!`)

    

    const recipeNameExists = await Recipe.findOne({name: name})
    if(recipeNameExists) return res.status(400).send(`Resipe with name ${name} exists`)

    let recipe = new Recipe({
        name: name,
        description: description,
        instructions: instructions,
        nutritionalInfo: nutritionalInfo,
        recipeImage: recipeImage ,
        categories: {
            _id: categories._id,
            name: categories.name
        },
        ingredients: {
            _id: ingredients._id,
            name: ingredients.name
        }
    })

    recipe = await recipe.save()

    res.send(recipe)
})

router.delete("/:id", [auth, admin], async (req, res) => {
    const recipe = await Recipe.findByIdAndRemove(req.params.id)
    if(!recipe) return res.status(400).send(`No Recipe with id ${req.params.id} found!`)

    res.send(recipe)
})

router.put("/:id", [auth, admin], upload.single("recipeImage"), async (req, res) => {
    const {error} = validateRecipe(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const {name, description, instructions, nutritionalInfo, ingredientId, categoryId  } = req.body
    const recipeImage = req.file.path

    const ingredients = await Ingredient.findById(req.body.ingredientId)
    if(!ingredients) res.status(400).send(`No ingredient with id ${ingredientId} found!`)

    const categories = await Category.findById(req.body.categoryId)
    if(!categories) res.status(400).send(`No Category with id ${categoryId} found!`)

    

    const recipeNameExists = await Recipe.findOne({name: name})
    if(!recipeNameExists) return res.status(400).send(`Resipe with name ${name} does not exists`)

    let recipe = new Recipe({
        name: name,
        description: description,
        instructions: instructions,
        nutritionalInfo: nutritionalInfo,
        recipeImage: recipeImage,
        categories: {
            name: categories.name
        },
        ingredients: {
            name: ingredients.name
        }
    })

    recipe = await recipe.save()

    res.send(recipe)
})




module.exports = router
