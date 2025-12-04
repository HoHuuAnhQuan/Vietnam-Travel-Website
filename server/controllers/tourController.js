const db = require('../config/db');

exports.getAllTours = (req, res) => {
    // Lấy các tham số lọc từ URL (nếu có)
    const { search, region, minPrice, maxPrice } = req.query;

    let sql = `
        SELECT t.*, p.name as province_name, p.region 
        FROM tours t
        JOIN provinces p ON t.province_id = p.province_id
        WHERE 1=1 
    `;
    
    const params = [];

    // 1. Nếu có từ khóa tìm kiếm (tên tour hoặc tên tỉnh)
    if (search) {
        sql += " AND (t.name LIKE ? OR p.name LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    // 2. Nếu có lọc theo miền
    if (region && region !== 'All') {
        sql += " AND p.region = ?";
        params.push(region);
    }

    // 3. Nếu có lọc theo giá
    if (minPrice) {
        sql += " AND t.price >= ?";
        params.push(minPrice);
    }
    if (maxPrice) {
        sql += " AND t.price <= ?";
        params.push(maxPrice);
    }

    // Sắp xếp tour mới nhất lên đầu
    sql += " ORDER BY t.created_at DESC";

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi lấy danh sách tour" });
        }
        res.status(200).json(results);
    });
};
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
// [ADMIN] Thêm Tour mới
exports.createTour = (req, res) => {
    const { name, description, price, duration, start_location, province_id, image, available_slots } = req.body;
    
    const sql = `
        INSERT INTO tours 
        (name, description, price, duration, start_location, province_id, image, available_slots) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Mặc định slots là 20 nếu không nhập
    const slots = available_slots || 20;

    db.query(sql, [name, description, price, duration, start_location, province_id, image, slots], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi thêm tour" });
        }
        res.status(201).json({ message: "Thêm tour thành công!", tourId: result.insertId });
    });
};

// [ADMIN] Cập nhật Tour 
exports.updateTour = (req, res) => {
    const { id } = req.params;
    const { name, description, price, duration, start_location, province_id, image, available_slots } = req.body;
    
    const sql = `
        UPDATE tours 
        SET name=?, description=?, price=?, duration=?, start_location=?, province_id=?, image=?, available_slots=?
        WHERE tour_id=?
    `;
    
    db.query(sql, [name, description, price, duration, start_location, province_id, image, available_slots, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi cập nhật tour" });
        }
        res.json({ message: "Cập nhật thành công!" });
    });
};

// [ADMIN] Xóa Tour
exports.deleteTour = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tours WHERE tour_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Đã xóa tour!" });
    });
};