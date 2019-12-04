const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const roomSchema = new mongoose.Schema({
    roomtitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    postalcode: {
        type: String,
        required: true,
        unique: true
    },
    rules: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    roompic: {
        type: String
    }
});

const Room = new mongoose.model("Room", roomSchema);
module.exports = Room; 