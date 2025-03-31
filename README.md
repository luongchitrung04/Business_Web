
# ProKicks - Hệ thống quản lý cửa hàng giày

## Giới thiệu

ProKicks là một hệ thống quản lý cửa hàng giày bóng đá bao gồm:
- **Frontend**: Ứng dụng Angular quản lý giao diện người dùng.
- **Backend**: Server Node.js xử lý API và giao tiếp với cơ sở dữ liệu.
- **Database**: MongoDB dùng để lưu trữ dữ liệu.

---

## Hướng dẫn cài đặt

### 1. **Cài đặt các công cụ cần thiết**
- Cài đặt **Node.js** từ [Node.js Official Website](https://nodejs.org/).
- Cài đặt **Angular CLI**:
  ```bash
  npm install -g @angular/cli
  ```
- Cài đặt **MongoDB Community Server** từ [MongoDB Official Website](https://www.mongodb.com/try/download/community).

---

### 2. **Clone project**
Tạo thư mục chứa project và tải code về:
```bash
mkdir prokicks-project
cd prokicks-project
```

Clone repository chứa frontend:
```bash
git clone https://github.com/HieuCaoPhanTrung/Web_Business.git temp-repo
mv temp-repo/prokicks ./prokicks
```

Clone repository chứa backend:
```bash
mv temp-repo/my-server ./my-server
rm -rf temp-repo
```

Sau khi clone thành công sẽ có cấu trúc thư mục như sau:
```plaintext
prokicks-project/
├── prokicks/    # Frontend - Angular
├── my-server/   # Backend - Node.js
```

---

### 3. **Khởi chạy Frontend**
1. Di chuyển vào thư mục `prokicks`:
   ```bash
   cd prokicks
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   ng serve -o
   ```
4. Frontend sẽ được mở trong trình duyệt tại [http://localhost:4200](http://localhost:4200).

---

### 4. **Cấu hình và khởi chạy Backend**
1. **Cài đặt MongoDB và tạo cơ sở dữ liệu**:
   - Mở MongoDB Compass hoặc terminal.
   - Tạo database `prokicks_db` với các collection:
     - **shoes**
     - **accessories**
     - **news**
   - Import dữ liệu tương ứng vào các collection từ thư mục `data`.

2. **Cài đặt thư viện cho backend**:
   - Di chuyển vào thư mục `my-server`:
     ```bash
     cd my-server
     ```
   - Cài đặt các thư viện cần thiết:
     ```bash
     npm install
     ```

3. **Khởi chạy backend**:
   ```bash
   npm start
   ```
4. Server backend sẽ hoạt động tại [http://localhost:3000](http://localhost:3000).

---

### 5. **Sử dụng**
- Mở frontend tại [http://localhost:4200](http://localhost:4200).
- Hệ thống backend sẽ hoạt động đồng thời tại [http://localhost:3000](http://localhost:3000).
- Dữ liệu được lưu trong cơ sở dữ liệu MongoDB `prokicks_db`.

---

## Thư viện sử dụng

### **Frontend**
- Angular CLI
- Bootstrap (CSS Framework)

### **Backend**
- Express.js (Node.js Framework)
- Mongoose (MongoDB ORM)
- bcrypt.js (Mã hóa mật khẩu)
- jsonwebtoken (JWT - Xác thực người dùng)
- nodemailer (Gửi email)

### **Database**
- MongoDB

---

## Tác giả
- **ProKicks**: [GitHub Repository](https://github.com/HieuCaoPhanTrung)
- Liên hệ: **hieucpt22406@st.uel.edu.vn**
