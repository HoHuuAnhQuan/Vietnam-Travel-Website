const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.post('/', bookingController.createBooking);


router.post('/', bookingController.createBooking);


router.get('/all', bookingController.getAllBookings); 
router.put('/:id', bookingController.updateBookingStatus); // Cập nhật trạng thái
router.get('/user/:userId', bookingController.getUserBookings); // <--- Lấy đơn của user
router.put('/cancel/:id', bookingController.cancelBookingByUser); // <--- User tự hủy
module.exports = router;