require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Dealer } = require('./models/dealer');

var app = express();

app.use(bodyParser.json());

app.post('/dealer', (req, res) => {
    var body = _.pick(req.body, ['dealer_Name', 'contact_Name', 'delaer_Mobile', 'email', 'contact_Mobile', 'address', 'pincode', 'password']);
    var dealer = new Dealer(body);

    dealer.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };
