require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const request = require('request');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');

var { mongoose } = require('./db/mongoose');
var { Dealer } = require('./models/dealer');
var { Login } = require('./models/login');
var { authenticate } = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    var body = _.pick(req.body, ['username', 'password']);
    var hashedPAssword;

    Login.findOne({
        username: body.username
    }, (err, login) => {
        if (!login) {
            return res.send("username doesnot exist")
        } else {
            console.log(login);
            hashedPAssword = login.password;
            bcrypt.compare(body.password, hashedPAssword, (err, resp) => {
                console.log(resp);

                if (resp === true) {
                    console.log(login);
                    res.header('x-auth', login.tokens[0].token).send({
                        username: login.username,
                        role: login.role
                    });
                } else {
                    res.send("wrong password");
                }
            })
        }

    })

    console.log(hashedPAssword);
    // bcrypt.compare(body.password, hashedPAssword, (err, resp) => {
    //      console.log(res);

    //     if(res === true){
    //         res.header('x-auth', login.tokens[0].token).send({
    //             username: login.username,
    //             role: login.role
    //         });
    //     }
    // })


    // Login.findOne({
    //     username: body.username,
    //     password: body.password
    // },
    // (err,login) => {
    //     if(err) return res.send(err);
    //     if(!login) return res.send('wrong login credentials')
    //     console.log(login);
    //      res.header('x-auth',login.tokens[0].token).send({ 
    //         username: login.username, 
    //         role: login.role
    //     });
    // })

})

app.post('/admin', (req, res) => {

    var body = _.pick(req.body, ['username', 'password']);
    var adminBody = {
        username: body.username,
        password: body.password,
        role: 'admin'
    }
    var login = new Login(adminBody);

    login.save().then(() => {
        return login.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({
            username: login.username,
            role: login.role
        });
    }).catch((e) => {
        res.status(400).send(e);
    });

})

app.post('/dealer',authenticate, (req, res) => {
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
            lat: '',
            lng: ''
        }]
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



        login.save().then(() => {
            return login.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send({
                username: login.username,
                role: login.role
            });
        }).catch((e) => {
            res.status(400).send(e);
        });

        // login.save().then((doc) => {
        //     res.send(doc);
        // }).catch((e) => {
        //     res.status(400).send(e);
        // });


        dealer.save().then((doc) => {
            //  res.send(doc);
        }).catch((e) => {
            res.status(400).send(e);
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log(dealer_body.email);
        const msg = {
            to: dealer_body.email,
            from: 'rentacar@experionglobal.com',
            subject: 'Welcome to Rent A Car',
            text: `Dear ${dealer_body.contact_Name},
                \n\t Dealer Created . 
                \n\t username: ${dealer_body.email}
                \n\t password:${dealer_body.password}
                \nRegards Sarath`
        };
        sgMail.send(msg);

    });

});


app.get('/dealer',authenticate, (req, res) => {
    Dealer.find().then((dealer) => {
        res.send({ dealer })
    }, (e) => {
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

