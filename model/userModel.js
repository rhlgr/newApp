const mongoose = require("mongoose");
const plm = require ("passport-local-mongoose")
const usermodel = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    phone:String,

})
usermodel.plugin(plm);

const User  = mongoose.model("useer", usermodel);
module.exports = User;