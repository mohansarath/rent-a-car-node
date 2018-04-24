var mongoose = require('mongoose');
const validator = require('validator');

const Dealer = mongoose.model('Dealer', {
    dealer_Name: {
        type: String,
        required: true
    },
    contact_Name: {
        type: String,
        required: true
    },
    created_On: {
        type: Number,
        default: null
    },
    dealer_Mobile: {
        type: Number,
        required: true
     
    },
    is_Active: {
        type: Boolean,
        default: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    is_Approved: {
        type: Boolean,
        default: false
    },
    contact_Mobile: {
        type: Number,
        required: true,
    
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    geoLocation: [{
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    }]
});

module.exports = { Dealer };