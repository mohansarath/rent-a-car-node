var mongoose = require('mongoose');
const validator = require('validator');

const Carmake = mongoose.model('Carmake', {
    name:{
        type:String
    }
});

const Carmodel = mongoose.model('Carmodel', {
    name: {
        type: String
    }
});

const Cartype = mongoose.model('Cartype', {
    name: {
        type: String
    }
});


const FuelType = mongoose.model('FuelType', {
    name: {
        type: String
    }
});

module.exports = { Carmake, Carmodel, Cartype, FuelType };