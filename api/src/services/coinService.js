const axios = require("axios")
const toCamelCase = require("../utils/format")

const API_URL = process.env.COINGECKO_API_URL || "https://api.coingecko.com/api/v3"

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Get top coins by market cap with search and sort options
exports.getTopCoins = async (currency = "usd", limit = 50, page = 1, query = "", sortBy = "market_cap_desc") => {
  try {
    const params = {
      vs_currency: currency,
      per_page: limit,
      page: page,
      sparkline: false,
    }

    if (sortBy) {
      params.order = sortBy
    }

    // If there's a search query, use the search endpoint first
    if (query) {
      const searchResponse = await api.get("/search", { params: { query } })

      if (searchResponse.data.coins.length === 0) {
        return []
      }

      const coinIds = searchResponse.data.coins.map((coin) => coin.id).join(",")

      params.ids = coinIds
      delete params.page 
    }

    const response = await api.get("/coins/markets", { params })

    return toCamelCase(response.data)
  } catch (error) {
    if (error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.")
      return this.getTopCoins(currency, limit, page, query, sortBy)
    }
    throw new Error("Failed to fetch coins")
  }
}

// Get detailed information for a specific coin
exports.getCoinDetails = async (id) => {
  try {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: true,
        developer_data: true,
        sparkline: false,
      },
    })

    return toCamelCase(response.data)
  } catch (error) {
    if (error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.")
      return this.getCoinDetails(id)
    }
    console.error(`Error fetching details for coin ${id}:`, error.message)
    throw new Error(`Failed to fetch details for coin: ${id}`)
  }
}

// Get coin price history with flexible time range
exports.getCoinPriceHistory = async (id, currency = "usd", days = "7") => {
  try {
    // Validate days parameter
    const validDays = ["1", "7", "14", "30", "90", "180", "365", "max", "0.04"]
    const daysParam = validDays.includes(days.toString()) ? days : "7"

    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days: daysParam,
      },
    })

    return toCamelCase(response.data)
  } catch (error) {
    if (error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.")
      return this.getCoinPriceHistory(id, currency, days)
    }

    console.error(`Error fetching price history for coin ${id}:`, error.message)
    throw new Error(`Failed to fetch price history for coin: ${id}`)
  }
}

