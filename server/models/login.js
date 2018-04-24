var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');``
const bcrypt = require('bcryptjs');

var LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true
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

LoginSchema.statics.findByToken = function (token) {
    var Login = this;
    var decoded;

    try {
        decoded = jwt.verify(token, '123abc');
    } catch (e) {
        return Promise.reject();
    }

    return Login.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }); 

};

LoginSchema.pre('save', function (next) {
    var login = this;

    if (login.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(login.password, salt, (err, hash) => {
                login.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});


const Login = mongoose.model('Login', LoginSchema)

module.exports = { Login };