const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Profile
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);

// Wishlist
router.get('/wishlist/:userId', userController.getWishlist);
router.post('/wishlist/toggle', userController.toggleWishlist);
router.get('/wishlist/check/:userId/:provinceId', userController.checkIsLiked);

module.exports = router;