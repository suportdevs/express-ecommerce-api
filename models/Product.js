const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    image: {type: String, required:true},
    categories:{type: Array},
    size: {type: Array},
    color: {type:Array},
    rate: {type: Number},
    isStock: {type: Boolean, default: true},
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);