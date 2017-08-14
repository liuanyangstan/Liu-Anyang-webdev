/**
 * Created by stan on 5/12/17.
 */

//using express with node js
var express = require('express');

//initialize app as an express application
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// load and configure the server to use cookie based session support.
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET || "This is a secret",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

// configure a public directory to host static content
// require("./assignment/app.js")(app);
require("./project/app.js")(app);
