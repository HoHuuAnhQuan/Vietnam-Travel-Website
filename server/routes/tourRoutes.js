const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

// Định nghĩa đường dẫn
router.get('/province/:provinceId', tourController.getToursByProvince); // Lấy tour theo tỉnh
router.get('/:id', tourController.getTourDetail); // Lấy chi tiết tour
router.get('/', tourController.getAllTours);
router.post('/', tourController.createTour);   // Tạo mới
router.put('/:id', tourController.updateTour); // Sửa
router.delete('/:id', tourController.deleteTour); // Xóa
module.exports = router;