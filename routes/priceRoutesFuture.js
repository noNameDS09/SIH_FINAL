const express = require('express');
const path = require('path');
const { getPricef } = require('../controllers/priceControllerFuture');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/get-price-future', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/find1.html'));
});

router.post('/get-price-future', getPricef);

module.exports = router;
