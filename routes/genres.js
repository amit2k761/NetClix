const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();
const Joi = require('joi');
const {Genre,validate}=require('../models/genre');
const auth = require('../middleware/auth');
router.get('/',async(req,resp)=>{
    const genre = await Genre
    .find()
    .sort('name')
    resp.send(genre);
});

router.post('/',[bodyEncodedParser,auth],async(req,resp)=>{
const {error}  =validate(req.body);

if (error) return resp.status(400).send(error.details[0].message);
let genre = new Genre({
    name:req.body.name
});

    genre = await genre.save()
   resp.send(genre);
});
router.put('/:id',bodyEncodedParser,async(req,resp)=>{
    
    const {error}  =validate(req.body);
    if (error) return resp.status(400).send(error.details[0].message);

   try{
    const genre = await Genre.findOneAndUpdate({_id : req.params.id},{name :req.body.name},{new : true});
    resp.send(genre);
   } catch(err){
     return resp.status(404).send('genre with given id not found');

   }


});
router.delete('/:id',async(req,resp)=>{

   const genre = await Genre.findOneAndRemove({_id : req.params.id})

    if(!genre) return resp.status(404).send('genre with given id not found');

   
    resp.send(genre);
});

module.exports=router;