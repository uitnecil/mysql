const express = require('express');
const router = express.Router();
const validate = require('express-validation');

router.get('/get-all', require('./all_data'));
router.put('/add-transaction', require('./add_data'));

module.exports = router;