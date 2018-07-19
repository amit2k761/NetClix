const config = require('config');

const express = require('express');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const auth = require('./routes/auth');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vidly',{ useNewUrlParser: true })
.then(()=>console.log('connected to mongoDB'))
.catch(err=> console.log(err.message));
const users = require('./routes/users');
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR :jwtPrivateKey is not defined');
    process.exit(1)
}

//app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
//app.use(express.json());
app.use('/api/auth',auth);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
