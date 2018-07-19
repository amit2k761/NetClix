const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');
const bodyEncodedParser = bodyparser.json();
const  {Customer,validate}=require('../models/customer')
    

router.get('/',async(req,resp)=>{
        const customer = await Customer
        .find()
        .sort('name')
        resp.send(customer);
    });

    router.post('/',bodyEncodedParser,async(req,resp)=>{
        const {error}  =validate(req.body);
        
        if (error) return resp.status(400).send(error.details[0].message);
        let customer = new Customer({
            name:req.body.name,
            phone:req.body.phone,
            isgold:req.body.isgold
        });
        customer = await customer.save()
           resp.send(customer);
        });

        router.put('/:id',bodyEncodedParser,async(req,resp)=>{
           
            const {error}  =validate(req.body);
            if (error) return resp.status(400).send(error.details[0].message);
        
           try{
            const customer = await Customer.findOneAndUpdate({_id : req.params.id},{name :req.body.name,phone:req.body.phone,isgold:req.body.isgold},{new : true});
            resp.send(customer);
           } catch(err){
             return resp.status(404).send('customer with given id not found');
        
           }
    
        });
        router.delete('/:id',async(req,resp)=>{
        
           const customer = await Customer.findOneAndRemove({_id : req.params.id})
        
       
            if(!customer) return resp.status(404).send('genre with given id not found');
        
            // const index = genres.indexOf(genre);
            // genres.splice(index,1);
            resp.send(customer);
        });

module.exports = router;