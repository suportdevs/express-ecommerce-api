const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    image: {type: String, required:true},
    categories:{type: Array},
    size: {type: String},
    color: {type:String},
    rate: {type: Number},
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);