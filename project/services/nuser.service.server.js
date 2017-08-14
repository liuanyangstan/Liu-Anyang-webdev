/**
 * Created by stan on 8/8/17.
 */

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function (app, userModel) {


    app.post("/rest/user", createUser);
    app.post("/rest/login", passport.authenticate('LocalStrategy'), login);
    app.post("/rest/logout", logout);
    app.post("/rest/register", register);
    app.get("/rest/user/getall",getAllUsers);
    app.get("/rest/user", findUser);
    app.get("/rest/user/:userId", findUserById);
    app.put("/rest/user/:userId", updateUser);
    app.delete("/rest/user/:userId", deleteUser);
    app.get("/rest/loggedin", loggedin);
    app.get("/rest/user/findfriends/:username",searchForUsername);
    app.post("/rest/following/:mainPersonID/follower/:followerID",followUser);
    app.post("/get/users/ids",getUsersOnSetOfIDS);
    app.post("/rest/unfollow/:mainPersonID/unfollower/:followerID",unfollowUser);


    //local strategy
    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    function localStrategy(username, password, done) {
        userModel
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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                        done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    //google oauth
    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID || '784600028147-75vik7vkgdj1qo83kmol9mr4ff6v6jdb.apps.googleusercontent.com',
        clientSecret : process.env.GOOGLE_CLIENT_SECRET || 'KNT732sqbfSwZex8riztJ6om',
        callbackURL  : process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
    };

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#!/user',
            failureRedirect: '/#!/login'
        }));


    app.use(session({
        secret: 'type something',
        resave: true,
        saveUninitialized: true
    }));


    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {

                        console.log("NEW PROFILE", profile);
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.displayName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id
                            }
                        };
                        console.log(newGoogleUser,"NEW GOOGLE USER");
                        return userModel
                            .createUser(newGoogleUser)
                            .then(function(user){
                                return done(null, user);
                            });
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                })
    }


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

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                    else{
                        res.json(null);
                    }
                }
            );
    }


    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        userModel
            .createUser(user)
            .then(
                function(newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            );
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        userModel
            .findUserById(userId)
            .then(
                function (existingUser) {
                    existingUser = existingUser[0];

                    if(existingUser){
                        if(user.password != existingUser.password){
                            user.password = bcrypt.hashSync(user.password);
                        }
                        userModel
                            .updateUser(userId,user)
                            .then(
                                function (user) {
                                    res.json(user);
                                },
                                function (error) {
                                    res.sendStatus(400).send(error);
                                }
                            );
                    }
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;

        userModel
            .findUserById(userId)
            .then(
                function (user) {
                    res.json(user[0]);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;

        if(username && password) {
            findUserByCredentials(req, res);
        } else if (username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;

        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }

    function findUserByCredentials(req, res){
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

    function deleteUser(req,res){
        var userId = req.params.userId;

        userModel
            .deleteUser(userId)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(500)
                }
            );
    }

    function getAllUsers(req,res) {

        userModel
            .findAllUsers()
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(500)
                }
            );
    }

    function searchForUsername(req,res) {
        var username = req.params.username;

        userModel
            .searchForUsername(username)
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }

    function followUser(req,res) {
        var mainPersonID = req.params.mainPersonID;
        var followerID = req.params.followerID;
        userModel
            .followUser(mainPersonID,followerID)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }


    function unfollowUser(req,res) {
        var mainPersonID = req.params.mainPersonID;
        var unfollowPersonID = req.params.followerID;

        userModel
            .unfollowUser(mainPersonID,unfollowPersonID)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }

    function getUsersOnSetOfIDS(req,res) {
        var userIds = req.body;

        userModel
            .getUsersOnSetOfIDS(userIds)
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(500);
                }
            );
    }
};