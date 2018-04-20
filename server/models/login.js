var mongoose = require('mongoose');
const validator = require('validator');

const Login = mongoose.model('Login', {
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true
    }
});





module.exports = { Login };