var { Login } = require('./../models/login');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    Login.findByToken(token).then((login) => {
        if (!login) {
            return Promise.reject();
        }
        req.login = login;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    })
}

module.exports = { authenticate };
