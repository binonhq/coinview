import { useGet, useLazyGet } from '@/hook/useFetch'
import type { Coin } from '@/types/coin'

export type SortOption = {
  field: 'totalVolume' | 'marketCap'
  direction: 'asc' | 'desc'
}

export type TimeRange = '1h' | '24h' | '7d' | '14d' | '30d' | '90d' | '1y'

export interface CoinDetail {
  id: string
  name: string
  symbol: string
  image: {
    large: string
    small: string
    thumb: string
  }
  marketData: {
    currentPrice: Record<string, number>
    marketCap: Record<string, number>
    totalVolume: Record<string, number>
    high24h: Record<string, number>
    low24h: Record<string, number>
    priceChangePercentage24h: number
    priceChangePercentage7d: number
    priceChangePercentage30d: number
    circulatingSupply: number
    totalSupply: number
    maxSupply: number
    allTimeHigh: {
      price: number
      date: string
    }
    ath: unknown
    atl: unknown
  }
  description: {
    en: string
  }
  links: {
    homepage: string[]
    blockchainSite: string[]
    officialForumUrl: string[]
    chatUrl: string[]
    twitterScreenName: string
    subredditUrl: string
  }
}

export interface PriceData {
  prices: [number, number][] // [timestamp, price]
  marketCaps: [number, number][] // [timestamp, market_cap]
  totalVolumes: [number, number][] // [timestamp, total_volume]
}

// Hook to get coins with search and sort options
export function useCoins(
  search?: string,
  sort?: SortOption,
  currency = 'usd',
  page = 1,
  limit = 50
) {
  const params: Record<string, string | number> = {
    vs_currency: currency,
    per_page: limit,
    page,
  }

  if (search) {
    params.query = search
  }

  if (sort) {
    params.sort_by = sort.field
    params.sort_direction = sort.direction
  }

  return useGet<Coin[]>(`/coins/markets`, params)
}

// Hook to get detailed information for a specific coin
export function useCoinDetail(id: string) {
  return useGet<CoinDetail>(`/coins/${id}`)
}

export function useLazyCoinDetail(id: string) {
  return useLazyGet<CoinDetail>(`/coins/${id}`, {})
}

// Hook to get price history for a specific coin based on time range
export function useCoinPriceHistory(
  id: string,
  timeRange: TimeRange,
  currency = 'usd'
) {
  const days = convertTimeRangeToDays(timeRange)

  return useGet<PriceData>(`/coins/${id}/market_chart`, {
    vs_currency: currency,
    days,
  })
}

export function useLazyCoinPriceHistory(
  id: string,
  timeRange: TimeRange,
  currency = 'usd'
) {
  const days = convertTimeRangeToDays(timeRange)

  return useLazyGet<PriceData>(`/coins/${id}/market_chart`, {
    vs_currency: currency,
    days,
  })
}

// Helper function to convert time range to days for API
function convertTimeRangeToDays(timeRange: TimeRange): string {
  switch (timeRange) {
    case '1h':
      return '0.04' // ~1 hour
    case '24h':
      return '1'
    case '7d':
      return '7'
    case '14d':
      return '14'
    case '30d':
      return '30'
    case '90d':
      return '90'
    case '1y':
      return '365'
    default:
      return '7'
  }
}
