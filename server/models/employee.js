var mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema( {
    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    doj: {
        type: Date,
        required: true
    },

    role: {
        type: String,
        required: true,
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

    gender: {
        type: String,
        required: false
    },

    dob: {
        type: Date,
        required: false
    },

    mobile: {
        type: Number,
        required: true,
    },

    address: {
        type: String,
        required: false
    },

    password: {
        type: String,
        minlength: 6
    },

    dealer_ID: [{ type: Schema.Types.ObjectId, ref: 'dealers' }]
});

const Employee = mongoose.model('employees', EmployeeSchema);

module.exports = { Employee };