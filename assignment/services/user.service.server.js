/**
 * Created by stan on 6/30/17.
 */
/*var users = require("./users.mock.json");*/

module.exports = function(app){

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];

    // GET Calls.
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:uid', findUserById);

    // POST Calls.
    app.post('/api/user', createUsers);

    // PUT Calls.
    app.put('/api/user/:uid', updateUser);

    // DELETE Calls.
    app.delete('/api/user/:uid', deleteUser);

    /*API implementation*/
    function createUsers(req, res) {
        var user = req.body;
        user._id = new Date().getTime().toString();
        users.push(user);
        res.json(user);
    }

    function findUserByUsername (req, res) {
        var username = req.query.username;

        for (u in users){
            var user = users[u];
            if(user.username === username){
                res.status(200).send(user);
                return;
            }
        }
        res.status(404).send("not found!");
    }

    function findAllUsers(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            for(var u in users) {
                var user = users[u];
                if( user.username === username &&
                    user.password === password ) {
                    res.json(user);
                    return;
                }
            }
            res.sendStatus(404);
            return;
        } else if (username) {
            for(var u in users) {
                var user = users[u];
                if( user.username === username ) {
                    res.json(user);
                    return;
                }
            }
            res.sendStatus(404);
            return;
        } else {
            res.json(users);
        }
    }

    function findUserByCredentials (req, res) {
        var username = req.query.username;
        var pswd = req.query.password;

        var user = users.find(function (u) {
            return u.username==username && u.password==pswd
        });
        res.send(user);
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        for(var u in users) {
            if(users[u]._id === uid) {
                res.send(users[u]);
                return;
            }
        }
        res.sendStatus(404);

    }

    function updateUser(req,res) {
        var user = req.body;
        var uid = req.params.uid;

        for(var u in users) {
            if(users[u]._id === uid) {
                users[u] = user;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function deleteUser(req,res) {
        var uid = req.params.uid;

        for (var u in users){
            if(users[u]._id === uid){
                users.splice(u,1);
                res.sendStatus(200);
                return;
            }
        }
        res.status(404).send("not found!");
    }
};