/**
 * Created by stan on 5/12/17.
 */
//using express with node js


//using express with node js
var express = require('express');

//initialize app as an express application
var app = express();

app.get('/test', function (req, res) {
    res.send('Text information received')
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(process.env.PWD + '/public/assignment'));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


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