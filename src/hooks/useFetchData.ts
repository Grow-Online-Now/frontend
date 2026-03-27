import { useState, useEffect, useCallback } from 'react'

interface UseFetchDataReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useFetchData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseFetchDataReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      setData(await fetcher())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}
