const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const bodyEncodedParser = bodyparser.json();

const Fawn = require('fawn');
const {Rental,validate} = require('../models/rentals');
const {Customer}=require('../models/customer');
const {Movie,movie}=require('../models/movies');

Fawn.init(mongoose);

router.get('/',async(req,resp)=>{
const rental = await Rental.find().sort('-dateout');
resp.send(rental);
});

router.post('/',bodyEncodedParser,async(req,resp)=>{
    const {error} =validate(req.body);
    if(error) return resp.status(400).send(error.details[0].message);

   const customer =await Customer.findOne({_id :req.body.customerId});
    if(!customer) return resp.status(404).send('customer with given id not found');

   
   const movie =await Movie.findOne({_id :req.body.movieId});
   if(!movie) return resp.status(404).send('movie with give id not found');
    //resp.send(movie)
   if(movie.numberInStock ===0) return resp.status(400).send("movie not for rent");

let rental = new Rental({
    customer : {
        _id : customer._id,
        name : customer.name,
        phone :customer.phone
    },
    movie : {
        _id :movie._id,
        title : movie.title,
        dailyRentalRate:movie.dailyRentalRate
    }
});
 //await rental.save();
 
 //movie.numberInStock-- ;
 //await movie.save();

try{
 new Fawn.Task()
 .save('rentals',rental)
 .update('movies',{_id : movie._id} , {$inc  : {numberInStock : -1}})
 .run();
 resp.send(rental);}
 catch(err){
     resp.status(500).send('internal server');
 }

});

module.exports = router;