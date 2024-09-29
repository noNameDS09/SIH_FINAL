const express = require('express');
const { getPrice, getPricesForThreeMonths } = require('../controllers/controller');
const { compareController } = require('../controllers/compareController')
const router = express.Router();

router.post('/get-price', getPrice);
router.post('/three-months', getPricesForThreeMonths);
router.post('/compare', compareController)
module.exports = router;

