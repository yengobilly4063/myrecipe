const Joi = require("joi")
const mongoose = require("mongoose")


const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 50,
    }, 
    quantity: {
        type: String,
        required: true, 
        minlength: 1,
        maxlength: 50,
    },
    comments: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 255,
    },
   
})

const Ingredient = mongoose.model("Ingredient", ingredientSchema)

validateIngredient = (ingredient) => {
    const ingredientSchema = {
        name: Joi.string().required().min(3).max(255),
        quantity: Joi.number().required().min(1).max(255),
        comments: Joi.string().required().min(5).max(255),
    }

    return Joi.validate(ingredient, ingredientSchema);
}


module.exports.ingredientSchema = ingredientSchema;
module.exports.Ingredient = Ingredient;
module.exports.validateIngredient = validateIngredient;