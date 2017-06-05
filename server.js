/**
 * Created by stan on 5/12/17.
 */
//using express with node js


var express = require('express');
var bodyParser = require('body-parser');

//initialize app as an express application
var app = express();

var ipaddress = '127.0.0.1';                    //local host: fixed
var port      = process.env.PORI || 5000;

app.use(express.static(__dirname+'/public/assignment'));   //folder name : public
app.listen(port, ipaddress);

app.listen(port);

console.log("hello world!");


/**
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public/assignment'));



app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
 **/