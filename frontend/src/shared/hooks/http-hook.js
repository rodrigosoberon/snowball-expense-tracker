import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttpClient = () => {
	// Manejo de estados
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const activeHttpRequests = useRef([])

	// Funcion para hacer peticiones http
	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		//* El useCallback es para evitar que la funcion se vuelva a crear cada vez que se renderiza el componente
		setIsLoading(true)

		//* Limpiar peticiones anteriores
		const httpAbortCtrl = new AbortController()
		activeHttpRequests.current.push(httpAbortCtrl)

		try {
			// Fetch de datos
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

			// Manejo de errores
			if (!response.ok) {
				throw new Error(responseData.message)
			}
			setIsLoading(false)
			return responseData // Devolucion de datos
		} catch (err) {
			setError(err.message || 'Something went wrong, please try again.')
			setIsLoading(false)
			throw err
		}
	}, [])

	// Funcion para limpiar el error
	const clearError = () => {
		setError(null)
	}

	// Limpiar peticiones anteriores
	useEffect(() => {
		return () => {
			activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
		}
	}, [])

	// Devolucion de estados y funciones
	return { isLoading, error, sendRequest, clearError }
}
