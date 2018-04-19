require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const request = require('request');

var { mongoose } = require('./db/mongoose');
var { Dealer } = require('./models/dealer');
var { Login } = require('./models/login');

var app = express();

app.use(bodyParser.json());

app.post('/dealer', (req, res) => {
    var body = _.pick(req.body, ['dealer_Name', 'contact_Name', 'delaer_Mobile', 'email', 'contact_Mobile', 'address', 'pincode', 'password', 'geoLocation']);
    var loginBody = {
        username: body.email,
        password: body.password,
        role: 'dealer'
    }
    var dealer_body = {
        dealer_Name: body.dealer_Name,
        contact_Name: body.contact_Name,
        delaer_Mobile: body.delaer_Mobile,
        email: body.email,
        contact_Mobile: body.contact_Mobile,
        address: body.address,
        pincode: body.pincode,
        password: body.password,
        geoLocation: [{
            lat:'',lng:''
        }
        ]
    }

    const url = dealer_body.pincode;
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${url}&key=AIzaSyChWOXtMjUBR4I61V5qrpz4UKnsu8Czudk`;
    var login = new Login(loginBody);
    
    request((geocodeUrl), function (error, response, body) {
        var x = JSON.parse(body);
        console.log('response:::::', x.results[0].geometry.location.lat);
        const lat = x.results[0].geometry.location.lat;
        const lng = x.results[0].geometry.location.lng;

        dealer_body.geoLocation[0].lat = lat;
        dealer_body.geoLocation[0].lng = lng;
        console.log('body::::::::::::', body);
        var dealer = new Dealer(dealer_body);
      

        login.save().then((doc) => {
            res.send(doc);
        }).catch((e) => {
            res.status(400).send(e);
        });
        dealer.save().then((doc) => {
            res.send(doc);
        }).catch((e) => {
            res.status(400).send(e);
        });

    });
    
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };
