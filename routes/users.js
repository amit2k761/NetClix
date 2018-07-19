const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();
const {User,validate}=require('../models/users');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
// _ is a object
router.post('/',bodyEncodedParser,async(req,resp)=>{
    const {error} = validate(req.body);
    if (error) return resp.status(400).send(error.details[0].message);
//to check if user already not registered

    let user = await User.findOne({email : req.body.email});
    if(user) return resp.status(400).send("user already registered");

    
user = new User(_.pick(req.body,['name','email','password']));
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt); 

await user.save();

   
const token = user.generateAuthToken();


resp.header('x-auth-token',token).send(_.pick(user,['name' , 'email']));

});

router.get('/me',auth,async(req,resp)=>{
const user = await User.findOne().select('-password');
resp.send(user);


});

module.exports =router;