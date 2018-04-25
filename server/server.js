require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const request = require('request');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
// var cors = require('cors')

var { mongoose } = require('./db/mongoose');
var { Dealer } = require('./models/dealer');
var { Login } = require('./models/login');
var Car = require('./models/car');
var { authenticate } = require('./middleware/authenticate');
var { Carmake, Carmodel, Cartype, FuelModel } = require('./models/master');
var { Settings} = require('./models/settings');

var app = express();

// app.use(cors())


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,x-auth');
    res.header('Access-Control-Expose-Headers', 'x-auth');
    next();
});

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    var body = _.pick(req.body, ['username', 'password']);
    var hashedPAssword;

    Login.findOne({
        username: body.username
    }, (err, login) => {
        if (!login) {
            return res.status(400).send("username doesnot exist")
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

app.post('/dealer', authenticate, (req, res) => {
    var body = _.pick(req.body, ['dealer_Name', 'contact_Name', 'dealer_Mobile', 'email', 'contact_Mobile', 'address', 'pincode', 'password', 'geoLocation']);
    var loginBody = {
        username: body.email,
        password: body.password,
        role: 'dealer'
    }
    var dealer_body = {
        dealer_Name: body.dealer_Name,
        contact_Name: body.contact_Name,
        dealer_Mobile: body.dealer_Mobile,
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


app.get('/dealer', authenticate, (req, res) => {
    Dealer.find().then((dealer) => {
        res.send({ dealer })
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/car', (req, res) => {
    var body = _.pick(req.body, ['kilometers', 'mileage', 'year', 'features', 'Type_ID', 'Make_ID', 'Model_ID', 'branch_ID', 'is_Rented', 'Dealer_ID']);
    var carbody = {
        kilometers: body.kilometers,
        mileage: body.mileage,
        year: body.year,
        features: [{
            exterior_Colour: '',
            interior_Colour: '',
            price: '',
            seater: '',
            is_AC: '',
            has_ABS: '',
            has_EBD: '',
            engine: '',
            fuel_Type_ID: '',
        }],
        Make_ID: body.Make_ID,
        Model_ID: body.Model_ID,
        branch_ID: body.branch_ID
    }

    var car = new Car(body);


    car.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });


})

app.post('/make', (req, res) => {
    var make = new Carmake(req.body);

    make.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
})


app.get('/car-rented', authenticate, (req, res) => {


    Car.find({ is_Rented: true })
        .populate('features.fuel_Type_ID')
        .populate('Type_ID')
        .populate('Make_ID')
        .populate('Model_ID')
        .populate('Dealer_ID')
        .then((car) => {

            return res.send(car)
        }, (e) => {
            res.status(400).send(e);
        })
})


app.get('/car-available', authenticate, (req, res) => {

    Car.find({ is_Rented: false })
        .populate('features.fuel_Type_ID')
        .populate('Type_ID')
        .populate('Make_ID')
        .populate('Model_ID')
        .populate('Dealer_ID')
        .then((car) => {
            return res.send(car)
        }, (e) => {
            res.status(400).send(e);
        })
})

app.post('/settings', (req, res)=> {
    var body = _.pick(req.body, ['commission']);
    var settings = new Settings(body);


    settings.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    });
 
})

app.get('/settings', (req, res) => {

    Settings.find().then((doc) => {
        return res.send(doc)
    },(e) => {
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

