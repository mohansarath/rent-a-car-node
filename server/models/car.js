var mongoose = require('mongoose');
const validator = require('validator');

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

    milage: {
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
            type: Boolean
        },

        has_ABS: {
            type: Boolean
        },

        has_EBD: {
            type: Boolean
        },

        engine: {
            type: String
        },

        fuel_Type_ID: [{ type: Schema.Types.ObjectId, ref: 'Fueltype' }],
        transmission_ID: [{ type: Schema.Types.ObjectId, ref: 'Transmissiontype' }]
    }],

    Type_ID: [{ type: Schema.Types.ObjectId, ref: 'Cartype' }],
    Make_ID: [{ type: Schema.Types.ObjectId, ref: 'Carmake' }],
    Model_ID: [{ type: Schema.Types.ObjectId, ref: 'Carmodel' }],
    branch_ID: [{ type: Schema.Types.ObjectId, ref: 'Branch' }]
})

module.exports = { Car }