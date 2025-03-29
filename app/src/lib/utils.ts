import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers
export const formatValue = (value: number | string) => {
  if (typeof value === 'string') return value

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  } else {
    return `$${value?.toLocaleString()}`
  }
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value > 100 ? 0 : 2,
    maximumFractionDigits: value > 100 ? 0 : value > 1 ? 2 : 6,
  }).format(value)
}

export const formatDate = (date: Date, range: string) => {
  if (range === '24h' || range === '1h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (range === '7d') {
    return date.toLocaleDateString([], {
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}
