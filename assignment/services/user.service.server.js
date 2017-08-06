/**
 * Created by stan on 6/30/17.
 */
/*var users = require("./users.mock.json");*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//google strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var bcrypt = require("bcrypt-nodejs");

var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function(app, models){
    // var users = [];
    var model = models.userModel;

    app.get('/api/user', findUserByUsername);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);
    app.get('/api/alluser', findAllUsers);


    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.post('/api/logout', logout);
    app.get('/api/loggedin', loggedin);
    app.post('/api/register', register);

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#!/profile',
            failureRedirect: '/#!/login'
        }));

    app.use(session({
        secret: 'type something',
        resave: true,
        saveUninitialized: true
    }));

    //google oauth
    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID || '658284546260-maikg11add3g2370532jbufmt66e7l2l.apps.googleusercontent.com',
        clientSecret : process.env.GOOGLE_CLIENT_SECRET || '-jYGmPHr-UV-bAJpr1j5DVNj',
        callbackURL  : process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        // console.log("profile: " + profile);

        model
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    // console.log("user: " + user);
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            password: "0",
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        // console.log(newGoogleUser);
                        return model.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    //local
    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    function localStrategy(username, password, done) {
        // console.log("local strategy: " + username);
        model
            .findUserByUsername(username)
            .then(
                function (user) {

                    if(user === null || user === undefined) {
                        return done(null, false, {message: 'User not found!'})
                    } else if (bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        console.log('User not found!!');
                        return done(null, false, {message: 'Username and password does not match!'});
                    }
                },
                function (err) {
                    if(err) {
                        console.log("error: " + err);
                        return done(err);
                    }
                }
            )
    }

    //session cookie functions
    function serializeUser(user, done) {
        done(null, user);
    }
    
    function deserializeUser(user, done) {
        model
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    //passport function implementation
    function login(req, res) {
        var user = req.user;
        delete user.password;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }
    
    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        model
            .createUser(user)
            .then(
                function (user) {
                    req.login(user, function (status) {
                        res.send(status);
                    })
                }
            )
    }
    
    
    /* REST Functions */
    function findAllUsers(req, res) {
        model
            .findAllUser()
            .then(
                function (users) {
                    res.json(users)
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )

    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        model
            .findUserByUsername(username)
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )

    }

    function findUserByCredentials(req, res) {
        var query = req.query;
        var username = query.username;
        var password = query.password;

        if(username && password) {
            model
                .findUserByCredentials(username, password)
                .then(
                    function (user) {
                        if(user){
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error) {
                        res.sendStatus(404).send(error);
                    }
                );
        }
    }
    
    function findUserById(req, res){
        var params = req.params;

        if(params.uid){
            model
                .findUserById(params.uid)
                .then(
                    function (user){
                        if(user){
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        }
    }

    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        model
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            );
    }

    function updateUser(req, res){
        var uid = req.params.uid;
        var user = req.body;
        model
            .updateUser(uid, user)
            .then(
                function (user){
                    res.json(user)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );
    }

    function deleteUser(req, res){
        var uid = req.params.uid;
        if(uid){
            model
                .deleteUser(uid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }
    }
};