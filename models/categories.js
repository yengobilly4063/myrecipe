const Joi = require("joi")
const mongoose = require("mongoose")


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50,
    }, 
   
})

const Category = mongoose.model("Category", categorySchema)

validateCategory = (category) => {
    const categorySchema = {
        name: Joi.string().required().min(5).max(255),
    }

    return Joi.validate(category, categorySchema);
}


module.exports.categorySchema = categorySchema;
module.exports.Category = Category;
module.exports.validateCategory = validateCategory;