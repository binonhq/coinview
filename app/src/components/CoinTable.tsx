'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, ArrowDown, LayoutGrid, TableIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { Coin, SortDirection, SortField } from '@/types/coin'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { SortOption } from '@/services/coinServices'
import { CoinCard } from './CoinCard'
import { CoinTableView } from './CoinTableView'
import { debounce } from 'lodash'
import { Skeleton } from './ui/skeleton'
import { MAX_COINS_PER_PAGE } from '@/contant/coinContant'

type ViewMode = 'grid' | 'table'

interface CoinTableProps {
  coins: Coin[]
  page?: number
  isLoading?: boolean
  showSearch?: boolean
  onSearch?: (query: string) => void
  onSortChange?: (sort: SortOption) => void
  onPageChange?: (page: number) => void
}

export const CoinTable = ({
  coins,
  page = 1,
  isLoading = false,
  showSearch = true,
  onSearch,
  onSortChange,
  onPageChange,
}: CoinTableProps) => {
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>(coins)
  const [sortField, setSortField] = useState<SortField>('marketCap')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setFilteredCoins(coins)
  }, [coins])

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        if (onSearch) {
          onSearch(query)
        } else {
          const filtered = coins.filter(
            (coin) =>
              coin.name.toLowerCase().includes(query) ||
              coin.symbol.toLowerCase().includes(query)
          )
          setFilteredCoins(filtered)
        }
      }, 300),
    [coins, onSearch]
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
  }

  const handleSortFieldChange = (field: SortField) => {
    // Toggle direction if same field
    const newDirection =
      field === sortField && sortDirection === 'desc' ? 'asc' : 'desc'

    setSortField(field)
    setSortDirection(newDirection)

    if (onSortChange) {
      // If we have an external sort handler, use it
      onSortChange({ field, direction: newDirection })
    } else {
      // Otherwise, sort locally
      setFilteredCoins((prevCoins) => {
        return [...prevCoins].sort((a, b) => {
          let valueA, valueB

          if (field === 'totalVolume') {
            valueA = a.totalVolume
            valueB = b.totalVolume
          } else if (field === 'marketCap') {
            valueA = a.marketCap
            valueB = b.marketCap
          } else {
            return 0
          }

          return newDirection === 'desc' ? valueB - valueA : valueA - valueB
        })
      })
    }
  }

  const getSortLabel = () => {
    const fieldLabel = (() => {
      switch (sortField) {
        case 'totalVolume':
          return 'Total Volume'
        case 'marketCap':
          return 'Market Cap'
        default:
          return ''
      }
    })()
    return `${fieldLabel} ${sortDirection === 'desc' ? '(High to Low)' : '(Low to High)'}`
  }

  const handlePageChange = (targetPage: number) => {
    if (targetPage > 0 && targetPage !== page) {
      onPageChange?.(targetPage)
    }
  }

  return (
    <div className="space-y-5 w-full max-w-[100rem]">
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-5">
        {showSearch && (
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary" />
            <Input
              placeholder="Search coins..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        )}

        <ToggleGroup
          variant="outline"
          className="w-32 ml-auto"
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as ViewMode)}
        >
          <ToggleGroupItem
            value="grid"
            aria-label="Grid view"
            className={
              viewMode === 'grid' ? '!bg-transparent !text-secondary' : ''
            }
          >
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="table"
            aria-label="Table view"
            className={
              viewMode === 'table' ? '!bg-transparent !text-secondary' : ''
            }
          >
            <TableIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        {viewMode === 'grid' && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-stone-900 border-stone-700 !text-white hover:bg-stone-800"
                >
                  {getSortLabel()}
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-stone-900 border-stone-700 text-white"
                align="end"
              >
                <DropdownMenuItem
                  onClick={() => handleSortFieldChange('marketCap')}
                  className="hover:bg-stone-800 focus:bg-stone-800 !text-white"
                >
                  MarketCap
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortFieldChange('totalVolume')}
                  className="hover:bg-stone-800 focus:bg-stone-800 !text-white"
                >
                  Total Volume
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5">
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
          <Skeleton className="h-40 rounded-xl bg-stone-800" />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-5">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => <CoinCard key={coin.id} coin={coin} />)
          ) : (
            <div className="col-span-4 flex justify-center">
              <p className="text-gray-200 text-2xl py-10">No results found</p>
            </div>
          )}
        </div>
      ) : (
        <CoinTableView
          coins={filteredCoins}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={handleSortFieldChange}
          startIndex={(page - 1) * MAX_COINS_PER_PAGE}
        />
      )}

      <div className="flex items-center justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          className="bg-stone-900 border-stone-700 !text-white hover:bg-stone-800 disabled:opacity-50"
        >
          <span className="sr-only">Previous page</span>
          <ArrowDown className="h-4 w-4 rotate-90" />
        </Button>

        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          className={`min-w-9 ${
            page === 1
              ? '!bg-stone-700 !text-white'
              : 'bg-stone-900 border-stone-700 !text-white hover:bg-stone-800'
          }`}
        >
          1
        </Button>

        {/* Show ellipsis if current page is > 3 */}
        {page > 3 && <span className="text-white mx-1">...</span>}

        {/* Show page before current if it exists and isn't page 1 */}
        {page > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            className="min-w-9 bg-stone-900 border-stone-700 !text-white hover:bg-stone-800"
          >
            {page - 1}
          </Button>
        )}

        {/* Current page (if not page 1) */}
        {page !== 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page)}
            className="min-w-9 bg-stone-700 !text-white"
          >
            {page}
          </Button>
        )}

        {/* Next page */}
        {filteredCoins.length >= MAX_COINS_PER_PAGE && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            className="min-w-9 bg-stone-900 border-stone-700 !text-white hover:bg-stone-800"
          >
            {page + 1}
          </Button>
        )}

        {/* Ellipsis to indicate more pages */}
        {filteredCoins.length >= MAX_COINS_PER_PAGE && (
          <span className="text-white mx-1">...</span>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={filteredCoins.length < MAX_COINS_PER_PAGE}
          onClick={() => handlePageChange(page + 1)}
          className="bg-stone-900 border-stone-700 !text-white hover:bg-stone-800"
        >
          <span className="sr-only">Next page</span>
          <ArrowDown className="h-4 w-4 rotate-270" />
        </Button>
      </div>
    </div>
  )
}
