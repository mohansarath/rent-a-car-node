var mongoose = require('mongoose');
const validator = require('validator');
var {Schema} = require('mongoose');

const CarSchema = new Schema({
    kilometers: {
        type: Number,
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

        fuel_Type_ID: [{ type: Schema.Types.ObjectId, ref: 'fueltypes' }],
    }],

    Type_ID: [{ type: Schema.Types.ObjectId, ref: 'cartypes' }],
    Make_ID: [{ type: Schema.Types.ObjectId, ref: 'carmakes' }],
    Model_ID: [{ type: Schema.Types.ObjectId, ref: 'carmodels' }],
    Dealer_ID: [{ type: Schema.Types.ObjectId, ref: 'dealers' }]
});

module.exports = mongoose.model('Car', CarSchema);