const db = require('../config/db');

// Lấy danh sách Tour theo ID Tỉnh
exports.getToursByProvince = (req, res) => {
    const { provinceId } = req.params;
    
    const sql = "SELECT * FROM tours WHERE province_id = ?";
    db.query(sql, [provinceId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

// Lấy chi tiết 1 Tour (Để sau này làm trang Booking)
exports.getTourDetail = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM tours WHERE tour_id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({message: "Tour not found"});
        res.json(results[0]);
    });
};