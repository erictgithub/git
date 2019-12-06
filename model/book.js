const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    roomId:{
        type: String,
        required: true
    },
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
    },
    price: {
        type: Number,
        required: true
    },
    roompic: {
        type: String,
        required: true
    }
});

const Book = new mongoose.model("Book", bookSchema);
module.exports = Book; 