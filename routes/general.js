const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.render("home");
});

router.get("/rooms",(req,res)=>{
    res.render("rooms")
});

module.exports = router;