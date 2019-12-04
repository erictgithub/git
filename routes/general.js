const express = require("express");
const router = express.Router();
const Room = require("../model/room");

router.get("/", (req, res)=>{
    res.render("home");
});

router.get("/rooms",(req,res)=>{
    const query = {}
    if(req.query.location){query.location = req.query.location}
    Room.find(query)
    .then(rooms => {
        res.render("rooms", {rooms})
    });
});

module.exports = router;