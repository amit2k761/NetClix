const mongoose = require('mongoose');
const Joi = require('joi');
const customerSchema =new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minlength :5,
        maxlength:50
    },
    isgold : {
        type : Boolean,
        default:false
    },
    phone : {
        type : String,
        required : true,
        min :5,
        max:50
    }
    })
const Customer =mongoose.model('Customer', customerSchema);

    function validateCustomer(customer){
        const schema ={
            name : Joi.string().min(5).max(50).required(),
            phone : Joi.string().min(5).max(50).required(),
            isgold:Joi.boolean()
        };
        return Joi.validate(customer,schema);
    };
    module.exports.customerSchema = customerSchema;
    module.exports.Customer = Customer;
    module.exports.validate=validateCustomer;