'use client'

import type React from 'react'

import { useState, useMemo, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import type { Coin } from '@/types/coin'
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react'
import { AreaChart, XAxis, Area, YAxis } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import {
  useLazyCoinDetail,
  useLazyCoinPriceHistory,
  type TimeRange,
} from '@/services/coinServices'
import { Skeleton } from './ui/skeleton'
import { formatCurrency, formatDate, formatValue } from '@/lib/utils'

interface CoinDetailProps {
  coin: Coin
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const CoinDetail = ({
  coin,
  open,
  onOpenChange,
  children,
}: CoinDetailProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h')

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1H' },
    { value: '24h', label: '1D' },
    { value: '7d', label: '1W' },
    { value: '30d', label: '1M' },
  ]

  // Fetch coin details and price history
  const {
    data: coinDetail,
    isLoading: isLoadingDetail,
    fetchData: fetchDetail,
  } = useLazyCoinDetail(coin.id)

  const {
    data: priceHistory,
    isLoading: isLoadingPriceHistory,
    error: priceHistoryError,
    fetchData: fetchPriceHistory,
  } = useLazyCoinPriceHistory(coin.id, selectedTimeRange, 'usd')

  // Fetch coin detail when the sheet opens
  useEffect(() => {
    if (open) {
      fetchDetail()
    }
  }, [open, fetchDetail])

  // Fetch price history when the time range changes
  useEffect(() => {
    if (open) {
      fetchPriceHistory()
    }
  }, [selectedTimeRange, open, fetchPriceHistory])

  // Format price history data for the chart
  const chartData = useMemo(() => {
    if (!priceHistory?.prices) return []

    return priceHistory.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp)
      return {
        date: formatDate(date, selectedTimeRange),
        price: price,
        timestamp: timestamp,
      }
    })
  }, [priceHistory, selectedTimeRange])

  // Prepare coin information data
  const coinData = useMemo(() => {
    return [
      {
        label: 'Market Cap',
        value: !isLoadingDetail
          ? coinDetail?.marketData?.marketCap?.usd || coin.marketCap
          : 'Loading...',
      },
      {
        label: 'All Time High',
        value: !isLoadingDetail
          ? coinDetail?.marketData?.ath?.usd || 'N/A'
          : 'Loading...',
      },
      {
        label: 'All Time Low',
        value: !isLoadingDetail
          ? coinDetail?.marketData?.atl?.usd || 'N/A'
          : 'Loading...',
      },
      {
        label: 'Circulating Supply',
        value: !isLoadingDetail
          ? coinDetail?.marketData?.circulatingSupply || 'N/A'
          : 'Loading...',
      },
    ]
  }, [coin, coinDetail, isLoadingDetail])

  return (
    <>
      {/* Trigger element */}
      <div onClick={() => onOpenChange(true)}>{children}</div>

      {/* Detail sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        {open && (
          <SheetContent
            side="right"
            className="!max-w-full text-white w-[100vw] overflow-auto lg:w-5xl bg-stone-900 border-white/10 px-[5vw] p-0"
          >
            <div className="my-12 p-12">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 justify-between w-full">
                  <div>
                    <p className="text-4xl font-bold mb-3 mt-5">{coin.name}</p>
                    <p className="text-3xl font-bold flex items-center">
                      <span className="text-secondary">$</span>
                      {coin.currentPrice} -
                      <div className="ml-2 flex items-center gap-1">
                        {Math.abs(coin.priceChangePercentage24h)?.toFixed(2)}%
                        {coin.priceChangePercentage24h >= 0 ? (
                          <TrendingUp className="h-6 w-6 mr-1 text-yellow-400" />
                        ) : (
                          <TrendingDown className="h-6 w-6 mr-1 text-red-400" />
                        )}
                      </div>
                    </p>
                  </div>
                  <img
                    className="w-24 h-24 my-auto"
                    src={coin.image || '/placeholder.svg'}
                    alt={coin.name}
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <Tabs
                  value={selectedTimeRange}
                  onValueChange={(value) =>
                    setSelectedTimeRange(value as TimeRange)
                  }
                  className="w-full"
                >
                  <TabsList className="w-full bg-stone-800 rounded-md">
                    {timeRanges.map((timeRange) => (
                      <TabsTrigger
                        key={timeRange.value}
                        value={timeRange.value}
                        className={`py-1.5 ${selectedTimeRange === timeRange.value ? '!bg-secondary' : 'text-white'}`}
                      >
                        {timeRange.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="mt-6 border rounded-md border-secondary p-6">
                <p className="font-semibold mb-6">{coin.name} Price(USD)</p>

                {isLoadingPriceHistory ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                  </div>
                ) : priceHistoryError ? (
                  <div className="flex items-center justify-center h-96 text-red-400">
                    Failed to load price history
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      price: {
                        label: 'Price',
                        color: 'hsl(var(--chart-1))',
                      },
                    }}
                  >
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorPrice"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="white"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="white"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        className="hidden"
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        minTickGap={30}
                      />
                      <YAxis
                        dataKey="price"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                        tickFormatter={(value) => {
                          if (value > 1000)
                            return `$${(value / 1000).toFixed(1)}k`

                          return `$${value.toFixed(value > 100 ? 0 : 2)}`
                        }}
                        domain={['auto', 'auto']}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                        }
                      />
                      <Area
                        type="linear"
                        dataKey="price"
                        stroke="white"
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ChartContainer>
                )}
              </div>

              <p className="mt-10 text-xl font-semibold">Information</p>
              <div className="mt-3 grid grid-cols-2 bg-stone-800 rounded-xl px-4 p-4">
                {isLoadingDetail
                  ? // Loading skeletons
                    Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="border-b border-stone-700 py-4"
                        >
                          <Skeleton className="h-4 w-24 bg-stone-700 mb-2" />
                          <Skeleton className="h-6 w-32 bg-stone-700" />
                        </div>
                      ))
                  : // Actual data
                    coinData.map((data) => (
                      <div
                        key={data.label}
                        className="border-b border-stone-700 py-4"
                      >
                        <p className="text-sm text-stone-400">{data.label}</p>
                        <p className="font-semibold">
                          {formatValue(data.value)}
                        </p>
                      </div>
                    ))}
              </div>

              {coinDetail?.description?.en && (
                <div className="mt-6">
                  <p className="text-xl font-semibold mb-3">
                    About {coin.name}
                  </p>
                  <div className="text-sm text-stone-300 leading-relaxed">
                    {coinDetail.description.en}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </>
  )
}
