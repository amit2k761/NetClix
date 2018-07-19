const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();
const Joi = require('joi');
const {Movie , validate} = require('../models/movies');
const  {Genre} = require('../models/genre');

router.get('/',async(req,resp)=>{
   const movies= await Movie.find().sort('name');
   resp.send(movies);
});

router.post('/',bodyEncodedParser,async(req,resp)=>{
    const {error} = validate(req.body);
    if(error) return resp.status(400).send(error.details[0].message);
   const genre = await Genre.findOne({_id : req.body.genreId});
   console.log(genre);


    if(!genre) return resp.status(400).send('invalid genre');


    const movie = new Movie({
        title : req.body.title,
        numberInStock : req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        genre : {
            _id : genre._id,
            name:genre.name
        }
    });  

      await movie.save();
    resp.send(movie);
});

router.put('/:id',bodyEncodedParser,async(req,resp)=>{
const {error}=validate(req.body);
if(error) return resp.status(400).send(error.details[0].message);

const genre = await findOne({_id : req.body.genreId});
if(!genre) return resp.status(404).send("invalid genre");

const movie = await Movie.findOneAndUpdate({_id:req.params.id},{
    title:req.body.title,
    genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true }
);

if(!movie) return resp.status(404).send('movie with given id not found')

resp.send(movie);
});

router.delete('/:id',async(req,resp)=>{

    const movie = await Movie.findOneAndRemove({_id:req.params.id});
    if(!movie) return resp.status(404).send('movie with given id not found');

    resp.send(movie);
});


module.exports = router;