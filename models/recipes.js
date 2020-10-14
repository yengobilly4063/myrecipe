const Joi = require("joi")
const mongoose = require("mongoose")
Joi.objectId = require('joi-objectid')(Joi);


const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50,
    }, 
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    instructions: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
    },

    nutritionalInfo: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255,
    },
    recipeImage: {
        type: String,
    },
    categories: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                require: true,
                minlength: 5,
                maxlength: 50,
            }
        })],
        required: true,
        min:1
    },
    ingredients: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                require: true,
                minlength: 3,
                maxlength: 50,
            }
        })],
        required: true,
        min:1
    }
   
})

const Recipe = mongoose.model("Recipe", recipeSchema)

validateRecipe = (recipe) => {
    const recipeSchema = {
        name: Joi.string().required().min(3).max(255),
        description: Joi.string().required().min(10).max(255),
        instructions: Joi.string().required().min(10).max(255),
        nutritionalInfo: Joi.string().required().min(5).max(255),
        categoryId: Joi.objectId().required(),
        ingredientId: Joi.objectId().required(),
    }

    return Joi.validate(recipe, recipeSchema);
}


module.exports.recipeSchema = recipeSchema;
module.exports.Recipe = Recipe;
module.exports.validateRecipe = validateRecipe;