const express = require("express")
const coinController = require("../controllers/coinController")

const router = express.Router()

// Coin routes
router.get("/coins/markets", coinController.getTopCoins)
router.get("/coins/search", coinController.searchCoins)
router.get("/coins/:id", coinController.getCoinDetails)
router.get("/coins/:id/market_chart", coinController.getCoinPriceHistory)

module.exports = router

 