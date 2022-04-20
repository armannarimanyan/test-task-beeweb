const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

const userSchema = new Schema({
    _id: { type: objectId, auto: true },
    name: { type: String, required: true, trim: true },
    role: { type: String,  trim: true  },
    userName: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
}, {
    versionKey: false
});


const user = mongoose.model('users', userSchema);

module.exports = user;