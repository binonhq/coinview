const coinService = require('../services/coinService');
const cache = require('../utils/cache');

// Get top coins by market cap
exports.getTopCoins = async (req, res, next) => {
  try {
    const {
      vs_currency = "usd",
      per_page = 50,
      page = 1,
      query = "",
      sort_by = "",
      sort_direction = "desc",
    } = req.query

    // Construct sort parameter
    let sortParam = ""
    if (sort_by) {
      if (sort_by === "price") {
        sortParam = `price_${sort_direction}`
      } else if (sort_by === "marketCap" || sort_by === "market_cap") {
        sortParam = `market_cap_${sort_direction}`
      } else if (sort_by === "totalVolume" || sort_by === "total_volume") {
        sortParam = `volume_${sort_direction}`
      }
    }

    const cacheKey = `topCoins_${vs_currency}_${per_page}_${page}_${query}_${sortParam}`
    const cachedData = cache.get(cacheKey)

    if (cachedData) {
      return res.json(cachedData)
    }

    const coins = await coinService.getTopCoins(vs_currency, per_page, page, query, sortParam)

    // Cache the result
    cache.set(cacheKey, coins)

    res.json(coins)
  } catch (error) {
    next(error)
  }
}

// Search coins
exports.searchCoins = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    const results = await coinService.searchCoins(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// Get coin details
exports.getCoinDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }
    
    const cacheKey = `coinDetails_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const coinDetails = await coinService.getCoinDetails(id);
    
    // Cache the result
    cache.set(cacheKey, coinDetails);
    
    res.json(coinDetails);
  } catch (error) {
    next(error);
  }
};

// Get coin price history
exports.getCoinPriceHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd', days = 7 } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }
    
    const cacheKey = `priceHistory_${id}_${vs_currency}_${days}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const priceHistory = await coinService.getCoinPriceHistory(id, vs_currency, days);
    
    // Cache the result
    cache.set(cacheKey, priceHistory);
    
    res.json(priceHistory);
  } catch (error) {
    next(error);
  }
};
