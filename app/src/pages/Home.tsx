'use client'

import { useState } from 'react'
import { CoinTable } from '@/components/CoinTable'
import { SortOption, useCoins } from '@/services/coinServices'
import { MAX_COINS_PER_PAGE } from '@/contant/coinContant'

export const HomePage = () => {
  const [formState, setFormState] = useState({
    search: '',
    sort: {
      field: 'marketCap',
      direction: 'desc',
    } as SortOption,
    direction: 'desc',
    page: 1,
  })

  const {
    data: coins,
    isLoading,
    error,
  } = useCoins(
    formState.search,
    formState.sort,
    'usd',
    formState.page,
    MAX_COINS_PER_PAGE
  )

  // Handle search input
  const handleSearch = (query: string) => {
    setFormState((prev) => {
      // Only reset the page if the search query changes
      if (prev.search !== query) {
        return {
          ...prev,
          search: query,
          page: 1, // Reset to the first page on search
        }
      }

      return prev
    })
  }

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setFormState((prev) => ({
      ...prev,
      sort: newSort,
      page: 1, // Reset to the first page on sort change
    }))
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFormState((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 px-[5vw] py-10">
      <div className="my-[7vh] flex flex-col items-center space-y-1 lg:space-y-4 grow justify-center">
        <h1 className="text-3xl lg:text-6xl font-bold text-center">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-secondary inline-block text-transparent bg-clip-text">
            CoinView!
          </span>
        </h1>
        <p className="text-md lg:text-xl text-light opacity-85 text-center">
          Stay Ahead in Crypto - Real-Time Prices at Your Fingertips
        </p>
      </div>

      {error && (
        <div className="w-full p-4 bg-red-500/10 border border-red-500 rounded-md text-center">
          <p className="text-red-500">
            Error loading data. Please try again later.
          </p>
        </div>
      )}

      <CoinTable
        coins={coins || []}
        isLoading={isLoading}
        page={formState.page}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
