var mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const CarmakeSchema = new Schema({
    name: {
        type: String
    }
});

const CarmodelSchema = new Schema({
    name: {
        type: String
    }
});

const CartypeSchema = new Schema({
    name: {
        type: String
    }
});


const FuelTypeSchema = new Schema({
    name: {
        type: String
    }
});

const Carmake = mongoose.model('carmakes', CarmakeSchema);
const Carmodel = mongoose.model('carmodels', CarmodelSchema);
const Cartype = mongoose.model('cartypes', CartypeSchema);
const FuelModel = mongoose.model('fueltypes', FuelTypeSchema);

module.exports = { Carmake, Carmodel, Cartype, FuelModel };