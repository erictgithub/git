const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const fileupload = require("express-fileupload");
require('dotenv') .config();

app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended : false}));
app.use(fileupload());

const DBURL= `mongodb+srv://${process.env.mongodbuser}:${process.env.mongodbpass}@cluster0-coitw.mongodb.net/${process.env.mongo_db}?retryWrites=true&w=majority`;
mongoose.connect(DBURL, {useNewUrlParser: true,
                    useUnifiedTopology: true})

.then(()=>{
    console.log(`Database is connected`)
})

.catch(err=>{
    console.log(`not connected : ${err}`);
})

app.use(methodOverride('_method'));

app.use(session({secret:process.env.secretKey}))

app.use((req,res,next)=>{
    res.locals.user= req.session.userInfo;
    next();
})


const generalRouter = require("./routes/general");
app.use("/", generalRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Welcome to BednBreakfast Assignment 1 on PORT: ${PORT}`)
});
