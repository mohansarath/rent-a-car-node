var mongoose = require('mongoose');
const validator = require('validator');
var {Schema} = require('mongoose');

const Car = mongoose.model('Car', {
    kilometers: {
        type: String,
        required: true
    },

    is_Active: {
        type: Boolean,
        default: true
    },

    is_Rented: {
        type: Boolean,
        default: false
    },

    mileage: {
        type: Number,
        required: true,
    },

    year: {
        type: Number,
        required: true
    },

    features: [{

        exterior_Colour: {
            type: String
        },

        interior_Colour: {
            type: String
        },

        price: {
            type: Number
        },

        seater: {
            type: Number
        },

        is_AC: {
            type: Boolean,
            default:true
        },

        has_ABS: {
            type: Boolean,
            default: true
        },

        has_EBD: {
            type: Boolean,
            default: true
        },

        engine: {
            type: String
        },

        fuel_Type_ID: [{ type: Schema.Types.ObjectId, ref: 'Fueltype' }],
    }],

    Type_ID: [{ type: Schema.Types.ObjectId, ref: 'Cartype' }],
    Make_ID: [{ type: Schema.Types.ObjectId, ref: 'Carmake' }],
    Model_ID: [{ type: Schema.Types.ObjectId, ref: 'Carmodel' }],
    branch_ID: [{ type: Schema.Types.ObjectId, ref: 'Branch' }]
})

module.exports = { Car }