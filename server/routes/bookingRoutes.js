const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// API: POST /api/bookings
router.post('/', bookingController.createBooking);


router.post('/', bookingController.createBooking);

// --- Route mới cho Admin ---
router.get('/all', bookingController.getAllBookings); // Lấy tất cả
router.put('/:id', bookingController.updateBookingStatus); // Cập nhật trạng thái
router.get('/user/:userId', bookingController.getUserBookings); // <--- Lấy đơn của user
router.put('/cancel/:id', bookingController.cancelBookingByUser); // <--- User tự hủy
module.exports = router;