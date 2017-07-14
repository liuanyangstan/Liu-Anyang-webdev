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

app.set('port', (process.env.PORT || 5000));
 app.use(express.static(__dirname + '/public/assignment'));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


//require("./temp/assignment/server_side/app.js")(app);
require("./assignment/app.js")(app);
