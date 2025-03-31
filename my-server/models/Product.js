const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoeSchema = new Schema({
    name: { type: String },
    brand: { type: String },
    type: { type: String },
    size: { type: Number },
    price: { type: Number },
    date: { type: String },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    image5: { type: String },
    color: { type: String },
    description: { type: String },
    discount: { type: Number },
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const AccessorySchema = new Schema({
    name: { type: String },
    brand: { type: String },
    type: { type: String },
    date: { type: String },
    price: { type: Number },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    image5: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const NewSchema = new Schema({
    title: { type: String },
    content: { type: String },
    date: { type: String },
    image: { type: String }
});

// Đảm bảo tên collection là "news"
module.exports = {
    Shoe: mongoose.model('Shoe', ShoeSchema, 'shoes'),
    Accessory: mongoose.model('Accessory', AccessorySchema, 'accessories'),
    New: mongoose.model('New', NewSchema, 'news') // Sửa tên collection thành "news"
};
