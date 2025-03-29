'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Coin, SortDirection, SortField } from '@/types/coin'
import { ArrowDown, ArrowRightToLine, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CoinDetail } from './CoinDetail'

interface CoinTableViewProps {
  coins: Coin[]
  startIndex: number
  sortField: SortField
  sortDirection: SortDirection
  onSortFieldChange: (field: SortField) => void
}

export const CoinTableView = ({
  coins,
  startIndex,
  sortField,
  sortDirection,
  onSortFieldChange,
}: CoinTableViewProps) => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === 'desc' ? (
      <ArrowDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUp className="ml-2 h-4 w-4" />
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1_000_000_000) {
      return `$${(marketCap / 1_000_000_000).toFixed(2)}B`
    } else if (marketCap >= 1_000_000) {
      return `$${(marketCap / 1_000_000).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }
  }

  return (
    <div className="rounded-md border border-stone-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-stone-900">
          <TableRow className="hover:bg-stone-800 border-stone-700">
            <TableHead className="pl-5 w-[50px] text-white">#</TableHead>
            <TableHead className="text-white text-bold">Name</TableHead>
            <TableHead className="text-white text-bold">Price</TableHead>
            <TableHead className="text-white text-bold">24h %</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="font-bold !p-0 hover:bg-transparent !text-white"
                onClick={() => onSortFieldChange('marketCap')}
              >
                MarketCap{getSortIcon('marketCap')}
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <Button
                variant="ghost"
                className="font-bold !p-0 hover:bg-transparent !text-white"
                onClick={() => onSortFieldChange('totalVolume')}
              >
                Volume{getSortIcon('totalVolume')}
              </Button>
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.length > 0 ? (
            coins.map((coin, index) => {
              const isOpen = selectedCoin === coin.id

              return (
                <TableRow className="hover:bg-stone-800 border-stone-700 cursor-pointer h-12 font-bold">
                  <TableCell className="pl-5">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-medium w-96">
                    <div className="flex items-center">
                      {coin.image && (
                        <img
                          src={coin.image || '/placeholder.svg'}
                          alt={coin.name}
                          className="w-6 h-6 mr-2 rounded-full"
                        />
                      )}
                      <span>{coin.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-96">
                    {formatPrice(coin.currentPrice)}
                  </TableCell>
                  <TableCell
                    className={
                      coin.priceChangePercentage24h >= 0
                        ? 'text-green-500 w-96'
                        : 'text-red-500 w-96'
                    }
                  >
                    {coin.priceChangePercentage24h > 0 ? '+' : ''}
                    {coin.priceChangePercentage24h?.toFixed(2)}%
                  </TableCell>
                  <TableCell className="w-96">
                    {coin.marketCap ? formatMarketCap(coin.marketCap) : 'N/A'}
                  </TableCell>
                  <TableCell className="w-96">
                    {coin.totalVolume
                      ? formatMarketCap(coin.totalVolume)
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <CoinDetail
                      key={coin.id}
                      coin={coin}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setSelectedCoin(open ? coin.id : null)
                      }
                    >
                      <Button
                        variant="outline"
                        className="mr-2 bg-stone-900 border-stone-700 cursor-pointer !text-white hover:bg-stone-800"
                      >
                        <ArrowRightToLine className="h-4 w-4" />
                      </Button>
                    </CoinDetail>
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No results found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
