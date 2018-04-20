var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');``

var LoginSchema = new mongoose.Schema({
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
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})



// LoginSchema.methods.toJSON = function () {
//     var login = this;
//     var loginObject = login.toObject();

//     return _.pick(loginObject, ['_id', 'username', 'role']);
// }

LoginSchema.methods.generateAuthToken = function () {
    var login = this;
    var access = 'auth';
    var token = jwt.sign({ _id: login._id.toHexString(), access }, '123abc').toString();
    // user.tokens.push({access, token})
    login.tokens = login.tokens.concat([{ access, token }]);

    return login.save().then(() => {
        return token
    });
};




const Login = mongoose.model('Login', LoginSchema)

module.exports = { Login };