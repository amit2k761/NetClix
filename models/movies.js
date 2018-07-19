const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const Joi = require('joi');
const movie = new mongoose.Schema({
    title : {
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        trim : true
    },
    numberInStock: {
        type:Number,
        required:true,
        min:0,
        max :255
    },
    dailyRentalRate : {
        type:Number,
        required : true,
        min:0,
        max:255
    },
    genre : {
        type : genreSchema,
        required:true
    }
    });

const Movie = mongoose.model('Movie',movie);

function validateMovie(Movie){
const schema = {
    title : Joi.string().min(5).max(255).required(),
    numberInStock:Joi.number().min(0).required(),
    dailyRentalRate:Joi.number().min(0).required(),
    genreId:Joi.objectId().required()
};
return Joi.validate(Movie,schema);
};
module.exports.movie = movie;
module.exports.Movie = Movie;
module.exports.validate = validateMovie;