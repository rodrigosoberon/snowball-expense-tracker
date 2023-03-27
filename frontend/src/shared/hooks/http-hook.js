import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
	// State management
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const activeHttpRequests = useRef([])

	// Create http requests
	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		// 'useCallback' to prevent execution with every component render
		setIsLoading(true)

		// Cleanup previous requests
		const httpAbortCtrl = new AbortController()
		activeHttpRequests.current.push(httpAbortCtrl)

		try {
			// Data fetching
			const response = await fetch(url, {
				method,
				body,
				headers,
				signal: httpAbortCtrl.signal
			})
			const responseData = await response.json()

			activeHttpRequests.current = activeHttpRequests.current.filter(
				reqCtrl => reqCtrl !== httpAbortCtrl
			)

			// Error handling
			if (!response.ok) {
				throw new Error(responseData.message)
			}
			setIsLoading(false)
			return responseData
		} catch (err) {
			setError(err.message || 'Something went wrong, please try again.')
			setIsLoading(false)
			throw err
		}
	}, [])

	// Error cleanup
	const clearError = () => {
		setError(null)
	}

	// Cleanup previous requests
	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
		}
	}, [])

	// Functions and states return
	return { isLoading, error, sendRequest, clearError }
}
