const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ĐĂNG KÝ
exports.register = (req, res) => {
    const { full_name, email, password } = req.body;
    // 1. Kiểm tra email đã tồn tại chưa
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) return res.status(400).json({ message: "Email này đã được sử dụng!" });
        // 2. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 8);
        // 3. Lưu vào DB
        db.query("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)", 
        [full_name, email, hashedPassword], 
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: "Đăng ký thành công! Hãy đăng nhập." });
        });
    });
};
// ĐĂNG NHẬP
exports.login = (req, res) => {
    const { email, password } = req.body;
    // 1. Tìm user theo email
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json({ message: "Email không tồn tại!" });
        const user = results[0];
        // 2. So sánh mật khẩu nhập vào với mật khẩu mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });
        // 3. Tạo Token (Thẻ thông hành)
        const token = jwt.sign({ id: user.user_id }, 'secret_key_vietnam_travel', { expiresIn: '1d' });
        // 4. Trả về thông tin user (trừ mật khẩu)
        const { password: _, ...userData } = user;
        res.status(200).json({ 
            message: "Đăng nhập thành công", 
            token, 
            user: userData 
        });
    });
};