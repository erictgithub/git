const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended : false}));

app.get("/",(req,res)=>{
    res.render("home")
});

app.get("/rooms",(req,res)=>{
    res.render("rooms")
});

app.get("/signup",(req,res)=>{
    res.render("signup")
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Welcome to BednBreakfast Assignment 1 on PORT: ${PORT}`)
});
