const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const hasAccess = require("../middleware/auth");
const hasAccessAdmin = require("../middleware/admin");
const Room = require("../model/room");
const path = require("path");

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {

    const errors = [];

    if (req.body.username == "") {
        errors.push("Please enter your username")
    }

    if (req.body.password == "") {
        errors.push("Please enter your password")
    }

    if (errors.length > 0) {

        res.render("login", {
            message: errors
        })
    }

    else {
        if (/^[a-zA-Z0-9]{6,12}$/.test(req.body.password)) {
            User.findOne({ email: req.body.email })
                .then(user => {
                    console.log(user);
                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatched => {
                            if (isMatched == true) {
                                req.session.userInfo = user;
                                if (user.admin) {
                                    res.redirect("/user/admin");
                                }
                                else {
                                    res.redirect("/user/welcome")
                                }
                            }
                            else {
                                errors.push("Sorry, your password does not match");
                                res.render("login", {
                                    message: errors
                                })
                            }
                        })
                })
                .catch(err => {
                    res.render("login", {
                        message: ["Incorrect Email or Password."]
                    })
                })

        }

        else {
            res.render("login", {
                message: ["Password must have letters and numbers only"]
            })
        }
    }

});

router.get("/signup", (req, res) => {
    res.render("signup")
});

router.post("/signup", (req, res) => {
    const error = [];

    if (req.body.firstname == "") {
        error.push("Please enter your Firstname")
    }

    if (req.body.lastname == "") {
        error.push("Please enter your Lastname")
    }

    if (req.body.email == "") {
        error.push("Please enter your Email")
    }

    if (req.body.password == "") {
        error.push("Please enter your Password")
    }

    if (req.body.birthday == "") {
        error.push("Please enter your Birthday")
    }

    if (error.length > 0) {

        res.render("signup",
            {
                message: error
            })
    }

    else {
        if (!(/^[a-zA-Z0-9]{6,12}$/.test(req.body.password))) {
            error.push("Password invalid, password must be at least 6 letters or numbers.");
        }

        if (!(/^[a-zA-Z]{2,26}$/.test(req.body.firstname))) {
            error.push("First name invalid.")
        }

        if (!(/^[a-zA-Z]{2,26}$/.test(req.body.lastname))) {
            error.push("Last name invalid.")
        }

        if (error.length > 0) {
            res.render("signup",
                {
                    message: error
                })
        }
        else {
            const formData = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                birthday: req.body.birthday,
            }
            console.log(process.env.sendgridapi);

            const ta = new User(formData);
            ta.save()
                .then(() => {
                    const nodemailer = require('nodemailer');
                    const sgTransport = require('nodemailer-sendgrid-transport');

                    const options =
                    {
                        auth: {
                            api_key: process.env.sendgridapi
                        }
                    }
                    console.log('Task was inserted into database')
                    const mailer = nodemailer.createTransport(sgTransport(options));

                    const email = {
                        to: `${req.body.email}`,
                        from: 'admin@bednbreakfast.com',
                        subject: 'Sign Up Confirmation',
                        text: `Thank you for signing with us!`,
                        html: `Thank you for signing with us!`
                    };

                    mailer.sendMail(email, (err, res) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(res);
                    });
                    res.redirect("/user/welcome");
                })
                .catch((err) => {
                    console.log(`Task was not inserted into the database because ${err}`)
                    res.render("signup", { message: ["Email already exist."] })
                });
        }

    }
});

router.get("/welcome", hasAccess, (req, res) => {
    res.render("welcome");
});

router.get("/admin", hasAccessAdmin, (req, res) => {
    res.render("admin");
});

router.get("/addroom", hasAccessAdmin, (req, res) => {
    res.render("addroom");
});

router.post("/addroom", hasAccessAdmin, (req, res) => {
    const error = [];

    if (req.body.roomtitle == "") {
        error.push("Please enter a Title for the room.")
    }

    if (req.body.location == "") {
        error.push("Please select the location of the room.")
    }

    if (req.body.postalcode == "") {
        error.push("Please enter a Postal or a Zip Code.")
    }
    else {
        if (!(/^[a-zA-Z0-9]{6}$/.test(req.body.postalcode))) {
            error.push("Please enter a valid Postal Code or Zip Code.");
        }
    }

    if (req.body.rules == "") {
        error.push("Please enter Rules for the room.")
    }

    if (req.body.desc == "") {
        error.push("Please enter a brief description of the room.")
    }

    if (req.body.price == null) {
        error.push("Please enter a price.")
    }

    if (req.files == null) {
        error.push("Sorry you must upload pictures of the room.")
    }
    else {
        if (req.files.roompic.mimetype.indexOf("image") == -1) {
            error.push("Sorry you can only upload images : Example (jpg,gif,png) ")
        }
    }

    if (error.length > 0) {

        res.render("addroom",
            {
                message: error
            })
    }
    else {
        const formData = {
            roomtitle: req.body.roomtitle,
            location: req.body.location,
            postalcode: req.body.postalcode,
            rules: req.body.rules,
            desc: req.body.desc,
            price: req.body.price,
        }

        const room = new Room(formData);
        room.save()
            .then(newroom => {
                req.files.roompic.name = `db_${newroom._id}${path.parse(req.files.roompic.name).ext}`

                req.files.roompic.mv(`public/uploads/${req.files.roompic.name}`)
                    .then(() => {
                        newroom.roompic = req.files.roompic.name;
                        newroom.save()
                        console.log(`File name was updated in the database`)
                        res.redirect("/rooms");
                    })
                    .catch(err => console.log(`Error :${err}`));
            })
    }
});

router.get("/edit/:id", hasAccessAdmin, (req, res) => {
    Room.findById(req.params.id)
    .then(room => (res.render("edit", {room:room._doc})))
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/")
});

module.exports = router;