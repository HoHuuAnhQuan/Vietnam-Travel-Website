const db = require('../config/db');

// Lấy danh sách review của 1 tour
exports.getReviewsByTour = (req, res) => {
    const { tourId } = req.params;
    const sql = `
        SELECT r.*, u.full_name, u.avatar 
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.tour_id = ?
        ORDER BY r.created_at DESC
    `;
    db.query(sql, [tourId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// Gửi review mới
exports.createReview = (req, res) => {
    const { user_id, tour_id, rating, comment } = req.body;
    const sql = "INSERT INTO reviews (user_id, tour_id, rating, comment) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [user_id, tour_id, rating, comment], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Đánh giá thành công!" });
    });
};