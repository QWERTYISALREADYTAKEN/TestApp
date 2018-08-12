//Environmental Variables
require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const lds = require('lodash');
let {mongoose, userModel} = require('./MongoosePart.js');
const bcrypt = require('bcrypt');
let bHash = require('./Helpers/BcryptToken_Pass');
let {ObjectID} = require('mongodb');
const {authenticate} = require('./MiddleWares/Authenticate.js');

//Helper
let {emptyHandler, boundaryCreator, errro, objectFilter, stts, emailObjects} = require('./Helpers/Helper.js');
const {salt, passSaltRounds, tokenSaltRounds} = require('./Helpers/Helper.js').hashSupport;

const url = '/';
let status = 200;

//Modifing for heroku
//process.env stores environmental variables
let port = process.env.PORT || 3000;

let app = express();
//End of Mongoose

//Necessary to parse JSON body
//bodyParser.json passes options which can be inflate, limit (file size), strict(when trueonly accepts arrays & objects), type, verify
app.use(bodyParser.json());
app.use(express.static(__dirname + '/Client'));

app.post('/register', (req, res) => {
    (async () => {
        try {
            var body = emptyHandler(req.body, () => {status = stts('empty'); errro(status)});
            body = emptyHandler(lds.pick(body, ['email', 'sex', 'password', 'firstName', 'lastName', 'userName', 'avIncome', 'avIncomeDescription', 'setAvIncome', 'birthDay', 'birthMonth', 'birthYear']), () => {status = stts('body'); errro(status)});
            body.age = new Date().getFullYear() - body.birthYear;
            
            //console.log(req.body);
            //console.log(body);
            
            var newUser = new userModel(body);
            var token = await newUser.generateToken('auth',salt,'bt',tokenSaltRounds);
            await newUser.hash(passSaltRounds, salt);
            r = emptyHandler(await newUser.save(), () => {status = stts('body', req.url); errro(status)});
            
            //Don't send user with the token inside it
            //Removing token
            r = objectFilter('sec', r._doc, '_id');
            r = emptyHandler(r, () => {status = stts('Empty'); errro(status)});
            
            //Sending Token as a header
            //'x-' is used for custom-defined headers
            res.header('x-auth', token).status(200).send(r);
        } catch(err) {
            console.log(err.message)
            status === 200? status = 500: status = status;
            res.status(status).send(JSON.stringify({err: err.message}));
        }
    })();
});

app.get('/', (req,res) => {
    res.status(200).send('Client');
});

app.post('/login', (req,res) => {
    (async () => {
        try {
            var checker;
            var body = emptyHandler(req.body, () => {status = stts('body', req.url); errro(status)});
            body = emptyHandler(body, () => {{status = stts('body', req.url); errro(status)}});
            
            var r = await userModel.findOne({userName: body.userName});
            r = emptyHandler(r, () => {status = stts('def', req.url); errro(status, undefined, 'Incorrect Username')});
            var checker = await bHash.compare(body.password, r._doc.password, 10, salt);
            if (checker === false) {
                status = stts('def', req.url); errro(status, undefined, 'Incorrect Password')
            }
            
            //Taking Token
            var token = r.tokens[0].token;
            
            //Usually tokens are created while logging in & deleted when logged out... Change That when you understand why
            
            //Filtering Sending Object
            r = objectFilter('sec', r._doc, 'tokens','passString');
            
            res.header('x-auth', token).status(200).send(JSON.stringify(r));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.status(status).send(JSON.stringify({err: err.message}));
        }
    })();
});

app.post('/logout', authenticate, (req,res) => {
    (async () => {
        try {
            //Taking Token
            var token = 'noAuth';
            res.header('x-auth', token).status(200).send(JSON.stringify({processStatus: true}));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.status(status).send(JSON.stringify({err: err.message}));
        }
    })();
});

app.post('/forgotPass', (req,res) => {
    (async () => {
        try {
            var body = emptyHandler(req.body, () => {status = stts('empty'); errro(status)});
             body = emptyHandler(lds.pick(body, ['userName']), () => {status = stts('def'); errro(status, undefined, 'emptyObject')});
            
            var r = await userModel.findOne({userName: body.userName});
            r = emptyHandler(r, () => {status = stts('def'); errro(status, undefined, 'emptyObject')});
            var email = r._doc.email;
            
            //Sending Data to Email...
            var {transporter, mailOptions} = emailObjects('gmail', 'AdminGmail@gmail.com', 'adminGmailPass', 'Budget App', email, 'request confirmed to change password');
            
            /*transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });*/
            
            //Taking Token
            var token = 'noAuth';
            res.header('x-auth', token).status(200).send(JSON.stringify({processStatus: true}));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.status(status).send(JSON.stringify({err: err.message}));
        }
    })();
});

app.post('/getData', authenticate, (req,res) => {
    var r = req.r;
    var token = req.token;
    var addObject = req.body;
    (async () => {
        try {

            if (req.body.type === 'income') {
                r._doc.data.income.push(addObject);
                r.save();
            } else if (req.body.type === 'expenses') {
                r._doc.data.expenses.push(addObject);
                r.save();
            }
            
            res.header('x-auth', token).status(200).send(JSON.stringify({processStatus: true}));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.header('x-auth', token).status(status).send(JSON.stringify({err: err.message}));
        }
    })()
});

app.post('/updateUserData', authenticate, (req,res) => {
    var r = req.r;
    var token = req.token;
    var updateObject = req.body;
    (async () => {
        try {
            updateObject = emptyHandler(lds.pick(updateObject, ['email', 'sex', 'password', 'firstName', 'lastName', 'userName', 'avIncome', 'avIncomeDescripiton', 'setAvIncome', 'birthDay', 'birthMonth', 'birthYear']), () => {status = stts('body'); errro(status)});
            var updateKeys = Object.keys(updateObject);
            var checker;
            for (current of updateKeys) {
                if (current !== 'password' && updateObject[current] !== ``) {
                    r[current] === updateObject[current]? () => {}: r[current] = updateObject[current];
                } else if (current === 'password' && updateObject[current] !== ``) {
                    checker = await bHash.compare(updateObject.password, r.password);;
                    if (checker === false) {
                        var pass = updateObject.password;
                        r[current] = await bHash.hash(pass, passSaltRounds, salt);
                        //Delete This Then
                        r.passString = pass;
                    }
                } else if (current !== 'password' && updateObject[current] === ``) {
                    status = stts('def'); errro(status, undefined, `${current} is empty`);
                }
            }
            if (updateObject.birtYear && updateObject.birtYear !==``) {
                r.age = new Date().getFullYear() - updateObject.birthYear;
            }
            r.save();
            
            res.header('x-auth', token).status(200).send(JSON.stringify({processStatus: true}));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.header('x-auth', token).status(status).send(JSON.stringify({err: err.message}));
        }
    })();
});

app.post('/removeData', authenticate, (req,res) => {
    var r = req.r;
    var token = req.token;
    var removeObject = req.body;
    (async () => {
        try {
            if (removeObject.type === 'income') {
                var index = r._doc.data.income.findIndex(e => e.id === removeObject.id);
                r._doc.data.income.splice(index, 1);
                r.save();
            } else if (removeObject.type === 'expenses') {
                 var index = r._doc.data.expenses.findIndex(e => e.id === removeObject.id);
                r._doc.data.expenses.splice(index, 1);
                r.save();
            }
            res.header('x-auth', token).status(200).send(JSON.stringify({processStatus: true}));
        } catch(err) {
            console.log(err);
            status === 200? status = 500: status = status;
            res.header('x-auth', token).status(status).send(JSON.stringify({err: err.message}));
        }
    })();
})

app.listen(port, () => {
    console.log(`Launched on Port: ${port}`);
});