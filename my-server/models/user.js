const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    phonenumber: { type: String, default: "" }, // Đổi kiểu dữ liệu thành String
    email: { type: String, required: true, unique: true },
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: Number,
            selectedSize: Number, // Thêm trường selectedSize
            image: String
        }
    ]
}, {
    timestamps: true // Tự động tạo createdAt và updatedAt
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});



// Phương thức kiểm tra mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Export mô hình
module.exports = mongoose.model('User', userSchema);
