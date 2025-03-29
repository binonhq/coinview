'use client'

import { useState } from 'react'
import type { Coin } from '@/types/coin'
import { ArrowRightToLine, TrendingDown, TrendingUp } from 'lucide-react'
import { CoinDetail } from './CoinDetail'

interface CoinCardProps {
  coin: Coin
}

export const CoinCard = ({ coin }: CoinCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  return (
    <div className="p-2">
      <CoinDetail
        coin={coin}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      >
        <div className="relative cursor-pointer overflow-hidden group w-full bg-stone-900 hover:bg-stone-800 hover:scale-[1.03] duration-300 rounded-xl p-4 flex gap-2">
          <div className="flex min-h-32 flex-col gap-2 justify-between">
            <img
              className="w-16 h-16"
              src={coin.image || '/placeholder.svg'}
              alt={coin.name}
            />
            <h1 className="text-md lg:text-xl font-bold">{coin.name}</h1>
          </div>

          <div className="ml-auto flex items-center h-fit gap-2 translate-x-6 group-hover:translate-x-0 transition-transform duration-300">
            <p className="text-md lg:text-xl font-semibold uppercase">
              {coin.symbol}
            </p>
            <ArrowRightToLine className="h-4 w-4 opacity-0 transform group-hover:opacity-100 duration-300" />
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col text-right gap-1">
            <div className="flex items-center gap-1 text-xs lg:text-sm justify-end">
              {coin.priceChangePercentage24h >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1 text-yellow-400" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-400" />
              )}
              {Math.abs(coin.priceChangePercentage24h)?.toFixed(2)}%
            </div>
            <p className="text-md lg:text-2xl flex items-center gap-1 justify-end">
              <span className="text-secondary">$</span>
              {coin.currentPrice}
            </p>
          </div>
        </div>
      </CoinDetail>
    </div>
  )
}
