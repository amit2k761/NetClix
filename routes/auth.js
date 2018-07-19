const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();
const {User}=require('../models/users');
const _ = require('lodash');
const bcrypt = require('bcrypt');
// _ is a object
const jwt  = require('jsonwebtoken');
const config = require('config');

router.post('/',bodyEncodedParser,async(req,resp)=>{
    const {error} = validate(req.body);
    if (error) return resp.status(400).send(error.details[0].message);
//now validate email

    let user = await User.findOne({email : req.body.email});
    if(!user) return resp.status(400).send(" invalid email or password ");
//validate password

const validPassword = await bcrypt.compare(req.body.password,user.password);
if(!validPassword) return resp.status(400).send('invalid email or password');

const token = user.generateAuthToken();
resp.send(token);

});

function validate(user){
    const schema = {
        email  : Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user,schema);
};

module.exports =router;