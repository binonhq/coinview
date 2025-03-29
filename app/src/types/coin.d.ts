export type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  currentPrice: number
  priceChangePercentage24h: number
  marketCap: number
  totalVolume: number
}

export type SortField = 'marketCap' | 'totalVolume'
export type SortDirection = 'desc' | 'asc'
