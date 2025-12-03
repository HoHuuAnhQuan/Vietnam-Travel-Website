const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/provinceController');

router.get('/', provinceController.getAllProvinces);
router.get('/:id', provinceController.getProvinceById);

module.exports = router;