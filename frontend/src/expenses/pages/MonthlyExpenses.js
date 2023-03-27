import React, { useState, useEffect, useContext } from 'react'

import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import ExpensesTable from '../components/ExpensesTable'

const MonthlyExpenses = () => {
	const [loadedExpenses, setLoadedExpenses] = useState()
	const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const auth = useContext(AuthContext)

	useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const responseData = await sendRequest('http://localhost:5000/api/expenses', 'GET', null, {
					Authorization: 'Bearer ' + auth.token
				})
				setLoadedExpenses(responseData.expenses)
			} catch (err) {}
		}
		fetchExpenses()
	}, [sendRequest, auth])

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && <LoadingSpinner asOverlay />}
			{!isLoading && loadedExpenses && <ExpensesTable expenses={loadedExpenses} curr={'$ '} />}
		</>
	)
}

export default MonthlyExpenses
