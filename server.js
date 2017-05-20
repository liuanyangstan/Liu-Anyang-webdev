/**
 * Created by stan on 5/12/17.
 */
//using express with node js
var express = require('express');
//var bodyParser = require('body-parser');

//initialize app as an express application
var app = express();

//var ipaddress = '127.0.0.1';                    //local host: fixed
var port      = process.env.PORI || 3000;

app.use(express.static(__dirname+'/public'));
//app.listen(port, ipaddress);
app.listen(port);

console.log("hello world!");