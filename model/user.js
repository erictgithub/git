const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    },
    admin: {
      type: Boolean,
      default: false
    }
});

UserSchema.pre("save",function(next){
  
    bcrypt.genSalt(10)
    .then(salt=>{
        bcrypt.hash(this.password,salt)
        .then(hash=>{
            this.password=hash
            next();
        })
    })

})

const User = new mongoose.model("User", UserSchema);
module.exports = User; 