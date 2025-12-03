const db = require('../config/db');

// --- PHẦN 1: PROFILE ---

// Lấy thông tin chi tiết user
exports.getProfile = (req, res) => {
    const { id } = req.params;
    db.query("SELECT user_id, full_name, email, phone, role FROM users WHERE user_id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
};

// Cập nhật thông tin user
exports.updateProfile = (req, res) => {
    const { id } = req.params;
    const { full_name, phone } = req.body; // Chỉ cho sửa tên và sđt
    
    db.query("UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?", [full_name, phone, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cập nhật thành công!" });
    });
};

// --- PHẦN 2: WISHLIST (YÊU THÍCH TỈNH) ---

// Lấy danh sách tỉnh yêu thích của user
exports.getWishlist = (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT p.* FROM wishlist w
        JOIN provinces p ON w.province_id = p.province_id
        WHERE w.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Thêm hoặc Xóa yêu thích (Toggle)
exports.toggleWishlist = (req, res) => {
    const { user_id, province_id } = req.body;

    // Kiểm tra xem đã like chưa
    db.query("SELECT * FROM wishlist WHERE user_id = ? AND province_id = ?", [user_id, province_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            // Đã like -> Xóa (Unlike)
            db.query("DELETE FROM wishlist WHERE user_id = ? AND province_id = ?", [user_id, province_id], () => {
                res.json({ message: "Đã xóa khỏi yêu thích", status: 'removed' });
            });
        } else {
            // Chưa like -> Thêm (Like)
            db.query("INSERT INTO wishlist (user_id, province_id) VALUES (?, ?)", [user_id, province_id], () => {
                res.json({ message: "Đã thêm vào yêu thích", status: 'added' });
            });
        }
    });
};

// Kiểm tra 1 tỉnh cụ thể có được like chưa (để hiện màu tim đỏ/trắng)
exports.checkIsLiked = (req, res) => {
    const { userId, provinceId } = req.params;
    db.query("SELECT * FROM wishlist WHERE user_id = ? AND province_id = ?", [userId, provinceId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ isLiked: results.length > 0 });
    });
};