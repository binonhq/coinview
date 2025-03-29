'use client'

import { useState, useEffect, useCallback } from 'react'
import axios, { type AxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

interface UseFetchState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export function useFetch<T = unknown>(
  url: string,
  options: AxiosRequestConfig = {}
) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const fullUrl = `${API_URL}${url}`
      const response = await axios(fullUrl, options)
      setState({
        data: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('An error occurred'),
      })
    }
  }, [url, JSON.stringify(options)])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

export function useLazyFetch<T = unknown>(
  url: string,
  options: AxiosRequestConfig = {}
) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const fullUrl = `${API_URL}${url}`
      const response = await axios(fullUrl, options)
      setState({
        data: response.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('An error occurred'),
      })
    }
  }, [url, JSON.stringify(options)])

  return {
    ...state,
    fetchData,
  }
}

// Helper hooks for common HTTP methods
export function useGet<T = unknown>(url: string, params?: unknown) {
  return useFetch<T>(url, { method: 'GET', params })
}

export function usePost<T = unknown>(url: string, data?: unknown) {
  return useFetch<T>(url, { method: 'POST', data })
}

export function usePut<T = unknown>(url: string, data?: unknown) {
  return useFetch<T>(url, { method: 'PUT', data })
}

export function useDelete<T = unknown>(url: string) {
  return useFetch<T>(url, { method: 'DELETE' })
}

export function useLazyGet<T = unknown>(url: string, params?: unknown) {
  return useLazyFetch<T>(url, { method: 'GET', params })
}

export function useLazyPost<T = unknown>(url: string, data?: unknown) {
  return useLazyFetch<T>(url, { method: 'POST', data })
}

export function useLazyPut<T = unknown>(url: string, data?: unknown) {
  return useLazyFetch<T>(url, { method: 'PUT', data })
}

export function useLazyDelete<T = unknown>(url: string) {
  return useLazyFetch<T>(url, { method: 'DELETE' })
}
