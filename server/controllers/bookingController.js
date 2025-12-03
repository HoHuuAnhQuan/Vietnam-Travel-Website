const db = require('../config/db');

exports.createBooking = (req, res) => {
    const { user_id, tour_id, start_date, num_people, total_price } = req.body;

    const sql = `
        INSERT INTO bookings (user_id, tour_id, start_date, num_people, total_price, status) 
        VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    db.query(sql, [user_id, tour_id, start_date, num_people, total_price], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server khi đặt tour" });
        }
        res.status(201).json({ message: "Đặt tour thành công!", bookingId: result.insertId });
    });
};
// [ADMIN] Lấy tất cả đơn hàng
exports.getAllBookings = (req, res) => {
    const sql = `
        SELECT b.*, t.name as tour_name, u.full_name, u.email, u.phone 
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        JOIN users u ON b.user_id = u.user_id
        ORDER BY b.booking_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
};

// [ADMIN] Cập nhật trạng thái đơn (Duyệt/Hủy)
exports.updateBookingStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status = 'confirmed' hoặc 'cancelled'

    const sql = "UPDATE bookings SET status = ? WHERE booking_id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    });
};
exports.getUserBookings = (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT b.*, t.name as tour_name, t.image, t.start_location 
        FROM bookings b
        JOIN tours t ON b.tour_id = t.tour_id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
};

// [USER] Khách hàng tự hủy đơn
exports.cancelBookingByUser = (req, res) => {
    const { id } = req.params; // Booking ID
    const { user_id } = req.body; // Lấy ID user để đảm bảo xóa đúng đơn của mình

    // Chỉ cho phép hủy nếu đơn chưa hoàn thành (logic tùy chọn)
    const sql = "UPDATE bookings SET status = 'cancelled' WHERE booking_id = ? AND user_id = ?";
    
    db.query(sql, [id, user_id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(400).json({ message: "Không thể hủy đơn này" });
        
        res.status(200).json({ message: "Đã hủy đơn thành công" });
    });
};