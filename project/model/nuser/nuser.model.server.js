/**
 * Created by stan on 8/8/17.
 */

module.exports = function () {

    var model = null;

    var mongoose = require('mongoose');
    var q = require('q');

    var nuserSchema = require('./nuser.schema.server')();
    var nuserModel = mongoose.model('nuserModel', nuserSchema);

    var api = {
        'createUser': createUser,
        'findUserById': findUserById,
        'findUserByUsername': findUserByUsername,
        'findUserByCredentials':findUserByCredentials,
        'updateUser':updateUser,
        'deleteUser':deleteUser,
        'findAllUsers':findAllUsers,
        'findUserByGoogleId':findUserByGoogleId,
        'searchForUsername':searchForUsername,
        'followUser':followUser,
        'unfollowUser':unfollowUser,
        'getUsersOnSetOfIDS':getUsersOnSetOfIDS,
        'setModel': setModel
    };

    return api;

    function createUser(user) {
        var deferred = q.defer();

        nuserModel.findOne({username:user.username},
            function (err,existingUser){
                if(existingUser == null){
                    nuserModel
                        .create(user, function (err, user) {
                            if(err) {
                                deferred.abort(err);
                            } else {
                                deferred.resolve(user);
                            }
                        });
                }
                else{
                    deferred.resolve(null);
                }
            });
        return deferred.promise;
    }

    function findUserById(userId){
        var deferred = q.defer();
        nuserModel
            .find({_id:userId}, function (err, user) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function findUserByUsername(username){
        var deferred = q.defer();
        nuserModel
            .find({username:username}, function (err, user) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(user[0]);
                }
            });
        return deferred.promise;
    }

    function findUserByGoogleId(id) {
        return nuserModel.findOne({"google.id":id});
    }

    function findUserByCredentials(username,password){
        // console.log("landed here:"+username);
        var deferred = q.defer();
        nuserModel
            .find({username:username}, function (err, user) {
                if(!user) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(user[0]);
                }
            });
        return deferred.promise;
    }

    function findAllUsers(){
        var deferred = q.defer();
        nuserModel
            .find({}, function (err, users) {
                if(!users) {
                    console.log("err");
                    deferred.reject(err);
                } else {
                    deferred.resolve(users);
                }
            });
        return deferred.promise;
    }

    function updateUser(userId,user) {
        var deferred = q.defer();
        nuserModel
            .update({_id:userId},
                {
                    username: user.username,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin
                },
                function (err,user) {
                    if(err){
                        deferred.reject(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
        return deferred.promise;
    }


    function deleteUser(userId) {
        var deferred = q.defer();
        nuserModel
            .findByIdAndRemove(userId, function (err, user) {
                if(err)
                    deferred.reject(err);
                else {
                    deferred.resolve(user);
                }
            });
        return deferred.promise;
    }

    function searchForUsername(uname) {
        var deferred = q.defer();
        nuserModel
            .find({username: { "$regex": uname, "$options": "i" }}, function (err, users) {
                if(!users) {
                    console.log("err");
                    deferred.reject(err);
                } else {
                    deferred.resolve(users);
                }
            });
        return deferred.promise;
    }

    function unfollowUser(mainPersonID,followerID) {
        var deferred = q.defer();
        nuserModel
            .find({_id:mainPersonID}, function (err, users) {
                var mainPerson = users[0];
                if(!mainPerson) {
                    console.log("err");
                    deferred.reject(err);
                } else {
                    nuserModel
                        .find({_id:followerID}, function (err, users) {
                            var unfollower = users[0];
                            if(!unfollower) {
                                console.log("err");
                                deferred.reject(err);
                            } else {
                                var index_m = mainPerson.followers.indexOf(unfollower._id);
                                mainPerson.followers.splice(index_m, 1);
                                var index_u = unfollower.following.indexOf(mainPerson._id);
                                unfollower.following.splice(index_u, 1);
                                mainPerson.save();
                                unfollower.save();

                                nuserModel
                                    .find({ _id: { $in: mainPerson.followers}},
                                        function (err, users) {

                                            deferred.resolve(users);
                                        });
                            }
                        });
                }
            });
        return deferred.promise;
    }
    function followUser(mainPersonID,followerID) {
        var deferred = q.defer();
        nuserModel
            .find({_id:mainPersonID}, function (err, users) {
                var mainPerson = users[0];
                if(!mainPerson) {
                    console.log("err");
                    deferred.reject(err);
                } else {
                    nuserModel
                        .find({_id:followerID}, function (err, users) {
                            var follower = users[0];
                            if(!follower) {
                                console.log("err");
                                deferred.reject(err);
                            } else {
                                mainPerson.followers.push(follower._id);
                                follower.following.push(mainPerson._id);
                                mainPerson.save();
                                follower.save();
                                nuserModel
                                    .find({ _id: { $in: mainPerson.followers}},
                                        function (err, users) {

                                            deferred.resolve(users);
                                        });
                            }
                        });
                }
            });
        return deferred.promise;
    }

    function getUsersOnSetOfIDS(userIds){
        var deferred = q.defer();
        nuserModel
            .find({ _id: { $in: userIds}},
                function (err, users) {
                    deferred.resolve(users);
                });
        return deferred.promise;
    }

    function setModel(_model) {
        model = _model;
    }
};