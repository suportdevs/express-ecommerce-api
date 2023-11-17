const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: {type: String},
    lastname: {type: String},
    username: {type: String, required: true, unique:true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    avatar: {type: String},
    role: {type: String, default: "User"},
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);