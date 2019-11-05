const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
require('dotenv') .config();
const UserSchema = new mongoose.Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    birthday: {
      type: Date,
      required: true
    }
  });
  
const User = new mongoose.model("User", UserSchema);

app.use(express.static("public"));
app.engine("handlebars", exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended : false}));

const DBURL= "mongodb+srv://eric:BNB@cluster0-coitw.mongodb.net/BedNBreakfast?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true,
                    useUnifiedTopology: true})

.then(()=>{
    console.log(`Database is connected`)
})

.catch(err=>{
    console.log(`not connected : ${err}`);
})


app.get("/",(req,res)=>{
    res.render("home")
});

app.get("/rooms",(req,res)=>{
    res.render("rooms")
});

app.get("/signup",(req,res)=>{
    res.render("signup")
});

app.post("/signup",(req,res)=>{
    const error=[];
    
    if(req.body.lastname=="")
    {
        error.push("Please enter your Lastname")
    }
    
    if(req.body.firstname=="")
    {
        error.push("Please enter your Firstname")
    }
    
    if(req.body.email=="")
    {
        error.push("Please enter your Email")
    }
    
    if(req.body.password=="")
    {
        error.push("Please enter your Password")
    }
    
    if(req.body.birthday=="")
    {
        error.push("Please enter your Birthday")
    }
    
    if(error.length > 0)
      {

          res.render("sign",
          {
             message:error
          })
      }
    
    else
      {
        if(!(/^[a-zA-Z0-9]{6,12}$/.test(req.body.password)))
        {
            error.push("invalid password,password must be at least 6 letters or numbers ");
        }
        if(!(/^[a-zA-Z]{2,20}$/.test(req.body.lastname)))
        {
        error.push("invalid Lastname")
        }
        if(!(/^[a-zA-Z]{2,20}$/.test(req.body.firstname)))
        {
        error.push("invalid Firstname")
        }
        if(error.length > 0)
         {

          res.render("sign",
          {
             message:error
          })
        }
        else 
        {
            const formData ={
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                password:req.body.password,
                birthday:req.body.birthday,
            }
            console.log(process.env.sendgridapi);

            const ta = new User(formData);
            ta.save()
            .then(() => 
            {
                console.log('Task was inserted into database')
            })
            .catch((err)=>{
                console.log(`Task was not inserted into the database because ${err}`)
            });
 
            const nodemailer = require('nodemailer');
            
            const sgTransport = require('nodemailer-sendgrid-transport');

             const options=
            {
            auth: {
                api_key: process.env.sendgridapi
            }
        }
       
        const mailer = nodemailer.createTransport(sgTransport(options));

        const email = {
            to: `${req.body.email}`,
            from: 'admin@bednbreakfast.com',
            subject: 'Sign Up Confirmation',
            text: `Thank you for signing with us!`, 
            html: `Thank you for signing with us!`
        };
         
        mailer.sendMail(email, (err, res)=> {
            if (err) { 
                console.log(err) 
            }
            console.log(res);
        });
        res.redirect("/room");
        }
        
        } 
    });

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/login",(req,res)=>{

    const errors =[];

    if(req.body.username=="")
    {
        errors.push("Please enter your username")
    }
    
    if(req.body.password=="")
    {
        errors.push("Please enter your password")
    }

      if(errors.length > 0)
      {

          res.render("login", {
             message:errors 
          })
      }

       else {
            if(/^[a-zA-Z0-9]{6,12}$/.test(req.body.password)) {
                User.find({ email: req.body.email })
                .then(user => {
                    console.log(user);
                    if (user.length == 1 && user[0].password == req.body.password){ 
                      res.redirect('/');
                    } 
                    else {
                        res.render("login", {
                            message:["Incorrect Email or Password."] 
                        })
                    }
                  })
                .catch(err => {
                    res.render("login", {
                        message:["Incorrect Email or Password."] 
                    })
                })

            }
      
            else {
                res.render("login", {
                message:["Password must have letters and numbers only"] 
                })
            }
       }   

});

app.get("/welcome", (req, res) =>{
    res.render("welcome");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Welcome to BednBreakfast Assignment 1 on PORT: ${PORT}`)
});
