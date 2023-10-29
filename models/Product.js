const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    category:{type: Array},
    rate: {type: Number},
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);