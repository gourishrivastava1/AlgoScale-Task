var mongoose = require("mongoose"),
passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    image   :String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);