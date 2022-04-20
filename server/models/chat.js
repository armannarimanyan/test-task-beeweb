const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.ObjectId;

const chatSchema = new Schema({
    _id: { type: objectId, auto: true},
    curentUserId: { type: String},
    fromUserId: { type: String},
    message:{type: Array}
})

const chat = mongoose.model('chat', chatSchema);

module.exports = chat;
