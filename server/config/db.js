const mongoose = require('mongoose'),
    user = require("../models/user");
    chat = require("../models/chat");
    mongoose.Promise = require('bluebird');
const connection = mongoose.connect('mongodb://localhost:27017/test_db', {
    useMongoClient: true
});

connection.on("user", function(ref) {
    console.log("Connected to mongo server.");
    user.find({ userName: 'admin' }, function(err, data) {
        if (err) {
            console.log("Error on Admin Find: ",err);
        } else {
            if (data.length === 0)
                createAdmin();
            else console.log("Admin already created");
        }
    });

    function createAdmin() {
        const model = new user({ name: 'Admin', userName: 'admin', password: 'admin', role: 'Admin' });
        model.save(function(err, result) {
            if (err) {
                console.log("error on Admin creation: ", err);
                return;
            }
            console.log("Admin created:");
        });
    }
});



module.exports = connection;