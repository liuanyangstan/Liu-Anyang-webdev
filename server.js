/**
 * Created by stan on 5/12/17.
 */

//using express with node js
var express = require('express');

//initialize app as an express application
var app = express();

var bodyParser = require('body-parser');

var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "This is a secret",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 5000));
 app.use(express.static(__dirname + '/public/assignment'));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

require("./assignment/app.js")(app);