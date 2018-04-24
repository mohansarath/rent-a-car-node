var mongoose = require('mongoose');
const validator = require('validator');

const Branch = mongoose.model('Branch', {
    location: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    mobile: {
        type: Number,
        required: true,
    },

    dealer_ID: [{ type: Schema.Types.ObjectId, ref: 'Dealer' }]
});

module.exports = { Branch};