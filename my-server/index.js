const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Đảm bảo bạn có một chuỗi bí mật an toàn
const nodemailer = require('nodemailer'); // Thư viện gửi email
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Email của bạn
        pass: 'your-app-password',    // Mật khẩu ứng dụng
    },
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// API gốc để kiểm tra server
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Kết nối MongoDB
const db = require('./config/db');
db.connect();

// Models
const { Shoe, Accessory, New } = require('./models/Product');
const User  = require('./models/user');  // Thêm dòng này để import model User
const Order = require('./models/order'); // Thêm dòng này để import Order model



app.get('/test-bcrypt', async (req, res) => {
    const plainPassword = "123456";
    const hashedPassword = "$2a$10$I4FJCz7w/OricJj8gTUjiuwrLQI7ZLu4/pgcM9yABXGcE1CTNX/N6"; // Mật khẩu từ DB
    
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        res.json({ success: isMatch });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách tất cả `shoes`
app.get("/shoes", async (req, res) => {
    try {
        const shoes = await Shoe.find({});
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Lấy danh sách giày có discount
app.get("/shoes/discount", async (req, res) => {
    try {
        const discountedShoes = await Shoe.find({ discount: { $exists: true, $gt: 0 } }); // Lọc giày có discount > 0
        res.json(discountedShoes);  // Trả về danh sách giày có discount
    } catch (err) {
        res.status(500).json({ error: err.message });  // Trả về lỗi nếu có
    }
});

// Lấy chi tiết giày theo ID
app.get("/shoes/:id", async (req, res) => {
    try {
        const shoeId = req.params.id;  // Lấy ID từ URL
        const shoe = await Shoe.findById(shoeId);  // Tìm sản phẩm giày trong DB
        if (!shoe) {
            return res.status(404).json({ error: "Shoe not found" });  // Nếu không tìm thấy giày
        }
        res.json(shoe);  // Trả về chi tiết giày
    } catch (err) {
        res.status(500).json({ error: err.message });  // Lỗi server
    }
});


// Thêm sản phẩm vào `shoes`
app.post("/shoe", async (req, res) => {
    try {
        const shoe = new Shoe(req.body);
        const savedShoe = await shoe.save();
        res.json(savedShoe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách tất cả `accessories`
app.get("/accessories", async (req, res) => {
    try {
        const accessories = await Accessory.find({});
        res.json(accessories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/accessories/:id", async (req, res) => {
    try {
        const accessoryId = req.params.id;  // Lấy ID từ URL
        const accessory = await Accessory.findById(accessoryId);  // Tìm sản phẩm giày trong DB
        if (!accessory) {
            return res.status(404).json({ error: "Accessory not found" });  // Nếu không tìm thấy giày
        }
        res.json(accessory);  // Trả về chi tiết giày
    } catch (err) {
        res.status(500).json({ error: err.message });  // Lỗi server
    }
});

// Thêm sản phẩm vào `accessories`
app.post("/accessory", async (req, res) => {
    try {
        const accessory = new Accessory(req.body);
        const savedAccessory = await accessory.save();
        res.json(savedAccessory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lấy danh sách tất cả `news`
app.get("/news", async (req, res) => {
    try {
        const news = await New.find({});
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/news/:id", async (req, res) => {
    try {
        const newId = req.params.id;  // Lấy ID từ URL
        const neww = await New.findById(newId);  // Tìm sản phẩm giày trong DB
        if (!neww) {
            return res.status(404).json({ error: "Accessory not found" });  // Nếu không tìm thấy giày
        }
        res.json(neww);  // Trả về chi tiết giày
    } catch (err) {
        res.status(500).json({ error: err.message });  // Lỗi server
    }
});

// Thêm một bài viết mới vào `news`
app.post("/news", async (req, res) => {
    try {
        const newsItem = new New(req.body);
        const savedNews = await newsItem.save();
        res.json(savedNews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sửa bài viết trong `news`
app.put("/news/:id", async (req, res) => {
    try {
        const updatedNews = await New.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedNews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Xóa một bài viết từ `news`
app.delete("/news/:id", async (req, res) => {
    try {
        await New.findByIdAndDelete(req.params.id);
        res.json({ message: "News item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tổng hợp tất cả sản phẩm từ `shoes` và `accessories`
app.get("/products", async (req, res) => {
    try {
        const shoes = await Shoe.find({});
        const accessories = await Accessory.find({});
        res.json({ shoes, accessories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Đăng nhập người dùng
// Đăng nhập
// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;


//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             console.error('Người dùng không tồn tại');
//             return res.status(404).json({ message: 'Người dùng không tồn tại' });
//         }

//         // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
//         // const hashedPassword = await bcrypt.hash(password, 10);
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         console.log('Mật khẩu đã nhập:', password);
//         console.log('Mật khẩu trong DB:', user.password);
//         console.log('Kết quả so sánh mật khẩu:', isPasswordMatch);

//         if (!isPasswordMatch) {
//             console.error('Mật khẩu không đúng');
//             return res.status(401).json({ message: 'Mật khẩu không đúng' });
//         }

//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
//         return res.status(200).json({ message: 'Đăng nhập thành công', token, userId: user._id });
//     } catch (err) {
//         console.error('Lỗi khi đăng nhập:', err.message);
//         res.status(500).json({ error: 'Lỗi server' });
//     }
// });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(401).json({ message: 'Mật khẩu không đúng' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Đăng nhập thành công', token, userId: user._id });
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.message);
        res.status(500).json({ error: 'Lỗi server' });
    }
});








app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả người dùng từ cơ sở dữ liệu
        res.json(users);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách người dùng:', err);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách người dùng' });
    }
});

// Đăng ký
// Đăng ký người dùng mới
// Đăng ký người dùng
app.post('/users', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        // const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký người dùng' });
    }
});






// Lấy thông tin người dùng
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Error fetching user' });
    }
});


// Cập nhật thông tin người dùng

// Cập nhật thông tin người dùng
app.patch('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { firstname, lastname, phonenumber, email, address } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'Missing user ID' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstname, lastname, phonenumber, email, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Cập nhật người dùng thành công:', updatedUser);
        res.json(updatedUser);
    } catch (err) {
        console.error('Lỗi khi cập nhật người dùng:', err);
        res.status(500).json({ message: 'Error updating user' });
    }
});
app.get('/cart/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('cart');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
});


app.post('/cart/:userId', async (req, res) => {
    const { cart } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Cập nhật giỏ hàng cho người dùng
        user.cart = cart;
        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: 'Error updating cart' });
    }
});


app.delete('/cart/:userId/:productId', async (req, res) => {
    const { userId, productId } = req.params;
    console.log(`Received DELETE request for userId: ${userId}, productId: ${productId}`);
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`User với ID ${userId} không tồn tại`);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Kiểm tra xem giỏ hàng có phần tử nào bị undefined hoặc thiếu productId không
      user.cart = user.cart.filter(item => {
        if (!item || !item.productId) {
          console.warn('Phần tử trong giỏ hàng bị thiếu productId:', item);
          return false; // Loại bỏ phần tử bị thiếu productId
        }
        return item.productId.toString() !== productId;
      });
  
      await user.save();
      res.json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng', cart: user.cart });
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', err);
      res.status(500).json({ message: 'Error deleting product from cart' });
    }
  });
// API để lưu đơn hàng
app.post('/orders', async (req, res) => {
    const { userId, orderId, customerName, phone, address, paymentMethod, items, totalAmount } = req.body;

    try {
        const newOrder = new Order({
            userId,
            orderId,
            customerName,
            phone,
            address,
            paymentMethod,
            items,
            totalAmount,
            status: 'Chờ xác nhận' // Trạng thái mặc định
        });

        await newOrder.save();
        res.status(201).json({ message: 'Đơn hàng đã được lưu thành công!' });
    } catch (error) {
        console.error('Lỗi khi lưu đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi khi lưu đơn hàng' });
    }
});
// API để lấy danh sách đơn hàng của người dùng
app.get('/orders/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
    }
});
// tìm kiếm sản phẩm 
// API để tìm kiếm sản phẩm
app.get('/api/products/search', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';

    try {
        // Tìm kiếm trong collection shoes
        const shoes = await Shoe.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } }
            ]
        });

        // Tìm kiếm trong collection accessories
        const accessories = await Accessory.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } }
            ]
        });

        // Kết hợp kết quả từ cả hai collection
        const products = [...shoes, ...accessories];
        res.json(products);
    } catch (err) {
        console.error('Error searching products:', err);
        res.status(500).json({ error: err.message });
    }
});

// API để hủy đơn hàng
app.patch('/orders/cancel/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // Tìm đơn hàng theo ID và chỉ hủy nếu trạng thái là "Chờ xác nhận"
        const order = await Order.findOneAndUpdate(
            { orderId, status: 'Chờ xác nhận' },
            { status: 'Đã hủy' },
            { new: true }
        );

        if (!order) {
            return res.status(400).json({ message: 'Không thể hủy đơn hàng. Đơn hàng không tồn tại hoặc đã được xử lý.' });
        }

        res.status(200).json({ message: 'Đơn hàng đã được hủy thành công.', order });
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        res.status(500).json({ error: 'Lỗi khi hủy đơn hàng' });
    }
});
app.get('/products/related/:brand/:excludeId', async (req, res) => {
    try {
        const { brand, excludeId } = req.params;

        // Lấy danh sách sản phẩm từ `shoes` cùng thương hiệu, loại bỏ sản phẩm hiện tại
        const relatedShoes = await Shoe.find({
            brand: brand,
            _id: { $ne: excludeId }, // Loại bỏ sản phẩm hiện tại
        }).limit(4); // Giới hạn kết quả trả về tối đa 4 sản phẩm

        res.json(relatedShoes); // Trả về danh sách sản phẩm liên quan
    } catch (error) {
        console.error('Error fetching related shoes:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
app.get('/accessories/related/:type/:excludeId', async (req, res) => {
    try {
        const { type, excludeId } = req.params;

        // Tìm các phụ kiện cùng loại, loại bỏ phụ kiện hiện tại
        const relatedAccessories = await Accessory.find({
            type: type,
            _id: { $ne: excludeId }, // Loại bỏ phụ kiện hiện tại
        }).limit(4); // Giới hạn tối đa 4 kết quả

        res.json(relatedAccessories); // Trả về danh sách phụ kiện liên quan
    } catch (error) {
        console.error('Error fetching related accessories:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
app.get('/news/latest/:excludeId', async (req, res) => {
    try {
      const { excludeId } = req.params;
  
      // Lấy tất cả bài viết ngoại trừ bài hiện tại
      const allNews = await New.find({ _id: { $ne: excludeId } });
  
      // Chuyển đổi string `date` thành đối tượng `Date` trong Node.js
      const sortedNews = allNews
        .map((news) => ({
          ...news._doc, // Sao chép toàn bộ trường của bài viết
          date: new Date(news.date.split('/').reverse().join('-')) // Chuyển "dd/MM/yyyy" thành "yyyy-MM-dd"
        }))
        .sort((a, b) => b.date - a.date) // Sắp xếp theo ngày giảm dần
        .slice(0, 4); // Lấy tối đa 4 bài viết gần nhất
  
      res.json(sortedNews);
    } catch (error) {
      console.error('Error fetching latest news:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
app.post('/password-reset', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Lấy từ biến môi trường
                pass: process.env.EMAIL_PASSWORD, // App Password từ Google
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Khôi phục mật khẩu',
            text: `Link đặt lại mật khẩu: http://localhost:4200/reset-password/${token}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email khôi phục mật khẩu đã được gửi.' });
    } catch (err) {
        console.error('Lỗi khi gửi email khôi phục mật khẩu:', err);
        res.status(500).json({ error: 'Lỗi server.' });
    }
});
  

  
  
  












// Lắng nghe trên cổng 3000
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
