const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Cấu hình gửi mail (Thay email và pass của bạn vào đây)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'quanho.070706@gmail.com', // Email của bạn
        pass: 'jswq oijc gxjs lzli' // Mật khẩu ứng dụng (Không phải pass đăng nhập)
    }
});

// 1. ĐĂNG KÝ (Gửi OTP)
exports.register = (req, res) => {
    const { full_name, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        const hashedPassword = await bcrypt.hash(password, 8);
        
        // Tạo mã OTP ngẫu nhiên 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu user với trạng thái chưa xác thực (is_verified = 0)
        const sql = "INSERT INTO users (full_name, email, password, otp_code, is_verified) VALUES (?, ?, ?, ?, 0)";
        
        db.query(sql, [full_name, email, hashedPassword, otp], (err, result) => {
            if (err) return res.status(500).json(err);

            // Gửi email
            const mailOptions = {
                from: 'Vietnam Travel Support',
                to: email,
                subject: 'Mã xác thực đăng ký Vietnam Travel',
                text: `Xin chào ${full_name},\n\nMã xác thực của bạn là: ${otp}\n\nVui lòng không chia sẻ mã này cho ai.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Lỗi gửi email xác thực!" });
                }
                res.status(201).json({ message: "Đăng ký thành công! Hãy kiểm tra email để lấy mã OTP.", email: email });
            });
        });
    });
};

// 2. XÁC THỰC OTP (Mới thêm)
exports.verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json({ message: "Email không tồn tại" });

        const user = results[0];

        if (user.otp_code === otp) {
            // OTP đúng -> Kích hoạt tài khoản, xóa OTP cũ
            db.query("UPDATE users SET is_verified = 1, otp_code = NULL WHERE email = ?", [email], (err) => {
                if (err) return res.status(500).json(err);
                res.status(200).json({ message: "Xác thực thành công! Bạn có thể đăng nhập ngay." });
            });
        } else {
            res.status(400).json({ message: "Mã OTP không chính xác!" });
        }
    });
};

// 3. ĐĂNG NHẬP (Sửa lại để chặn nếu chưa xác thực)
exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(400).json({ message: "Email không tồn tại!" });

        const user = results[0];

        // --- CHECK THÊM ĐOẠN NÀY ---
        if (user.is_verified === 0) {
            return res.status(403).json({ message: "Tài khoản chưa xác thực email! Vui lòng kiểm tra email." });
        }
        // ----------------------------

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu sai!" });

        const token = jwt.sign({ id: user.user_id }, 'secret_key_vietnam_travel', { expiresIn: '1d' });
        const { password: _, ...userData } = user;
        
        res.status(200).json({ message: "Đăng nhập thành công", token, user: userData });
    });
};