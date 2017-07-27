/**
 * Created by stan on 7/20/17.
 */

module.exports = function(mongoose){
    var userSchema = require('./user.schema.server.js')(mongoose);
    var userModel = mongoose.model('userModel', userSchema);

    var api = {
        'createUser' : createUser,
        'findAllUser' : findAllUser,
        'findUserById' : findUserById,
        'findUserByUsername' : findUserByUsername,
        'findUserByCredentials' : findUserByCredentials,
        'updateUser' : updateUser,
        'removeWebsiteFromUser' : removeWebsiteFromUser,
        'addWebsiteForUser' : addWebsiteForUser,
        'deleteUser' : deleteUser
    };

    return api;

    // Function Definition Section

    function createUser(user){
        var newUser = {
            username : user.username,
            password : user.password,
            websites : []
        };

        if(user.firstName){
            newUser.firstName = user.firstName;
        }
        if(user.lastName){
            newUser.lastName = user.lastName;
        }
        if(user.email){
            newUser.email = user.email;
        }
        if(user.phone){
            newUser.phone = user.phone;
        }

        return userModel.create(newUser);
    }

    function findUserById(userId){
        return userModel.findOne({_id: userId});
    }

    function findUserByUsername(uname){
        return userModel.findOne({username : uname})
    }


    function findUserByCredentials(username, password){
        return userModel.findOne({
            username : username,
            password : password
        });
    }

    function updateUser(userId, user){
        return userModel.update({
            _id : userId
        }, {
            firstName : user.firstName,
            lastName : user.lastName,
            email : user.email,
            phone : user.phone
        });
    }

    function removeWebsiteFromUser(userId, websiteId){
        // db.user.update({_id : ObjectId("583cf3287ac013080c4adee5")}, {$push : { "websites" : ObjectId("583cf43693b914082152cc3c")}})
        userModel
            .findOne({_id: userId})
            .then(
                function(user){
                    user.websites.pull(websiteId);
                    user.save();
                },
                function(error){
                    console.log(error);
                }
            );
    }

    function findAllUser() {
        return userModel.find();
    }
    
    function addWebsiteForUser(userId, websiteId) {
        console.log("added!");
        return userModel
            .findOne({_id: userId})
            .then(function (user) {
                    user.websites.push(websiteId);
                    return user.save();
                });
    }
    
    function deleteUser(userId){
        return userModel.remove({
            _id : userId
        });
    }
};