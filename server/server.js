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


app.get('/dealer', authenticate, (req, res) => {
    Dealer.find().then((dealer) => {
        res.send({ dealer })
    }, (e) => {
        res.status(400).send(e);
    })
})

app.post('/car', (req, res) => {
    var body = _.pick(req.body, ['kilometers', 'mileage', 'year', 'features', 'Type_ID', 'Make_ID', 'Model_ID', 'branch_ID', 'is_Rented']);
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


app.get('/car-rented', (req, res) => {


    Car.find({ is_Rented: true }).then((car) => {
        console.log(JSON.stringify(car));

        car.map((item) => {
            console.log(item);
        })

        res.send({ car })
    }, (e) => {
        res.status(400).send(e);
    })
})


app.get('/car-available', (req, res) => {

    var i = 0;
    var makeName, modelName, typeName, fuelName;
    Car.find({ is_Rented: false })
        .populate('features.fuel_Type_ID')
        .populate('Type_ID')
        .populate('Make_ID')
        .populate('Model_ID')
        .then((car) => {

            return res.send(car)
        }, (e) => {
            res.status(400).send(e);
        })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };

