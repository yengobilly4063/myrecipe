const config = require("config")
const express = require("express")
const app = express()
const morgan = require("morgan")
const mongoose = require('mongoose');
const userRoutes = require("./routes/users")
const auth = require("./routes/auth")
const categoryRoutes = require("./routes/categories")
const ingredientRoutes = require("./routes/ingredients")
const recipeRoutes = require("./routes/recipes")
const Joi = require('joi');

if(!config.get("jwtPrivateKey")){
    console.error("FATAL ERROR: jwt key not defined...")
    process.exit(1)
}


mongoose
    .connect('mongodb://localhost/cookbook', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('Connected to MongoDb');
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB...', err);
    });


app.use(morgan('dev'));
app.use("/uploads", express.static('uploads'))
app.use(express.json());
app.use("/api/users/", userRoutes)
app.use("/api/categories/", categoryRoutes)
app.use("/api/ingredients/", ingredientRoutes)
app.use("/api/recipes/", recipeRoutes)
app.use("/api/auth/", auth)




app.listen(3000, ()=> {
    console.log("Listening on port :3000...")
})