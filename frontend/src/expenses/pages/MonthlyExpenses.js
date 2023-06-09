import React, { useState, useEffect, useContext } from 'react'

import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import ExpensesTable from '../components/ExpensesTable'
import Modal from '../../shared/components/UIElements/Modal'
import Button from '../../shared/components/FormElements/Button'
import './MonthlyExpenses.css'
import IconButton from '../components/IconButton'

import { ReactComponent as Plus } from '../../shared/images/plus.svg'

const MonthlyExpenses = () => {
	const [loadedExpenses, setLoadedExpenses] = useState()
	const [showConfirmModal, setShowConfirmModal] = useState(false)
	const [expenseSelected, setExpenseSelected] = useState({
		id: '',
		date: '',
		description: '',
		amount: 0
	})
	const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const auth = useContext(AuthContext)

	useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const responseData = await sendRequest(
					'https://snowball-expense-tracker.onrender.com/api/expenses',
					'GET',
					null,
					{
						Authorization: 'Bearer ' + auth.token
					}
				)
				setLoadedExpenses(responseData.expenses)
			} catch (err) {}
		}
		fetchExpenses()
	}, [sendRequest, auth])

	const showDeleteWarningHandler = event => {
		setExpenseSelected(loadedExpenses.find(expense => expense.id === event.currentTarget.id))
		setShowConfirmModal(true)
	}

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false)
	}

	const expenseDeleteHandler = () => {
		setLoadedExpenses(prevExpenses =>
			prevExpenses.filter(expense => expense.id !== expenseSelected.id)
		)
	}

	const confirmDeleteHanlder = async () => {
		setShowConfirmModal(false)
		try {
			await sendRequest(
				`https://snowball-expense-tracker.onrender.com/api/expenses/${expenseSelected.id}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token
				}
			)
			expenseDeleteHandler()
		} catch (err) {}
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header='Confirm delete?'
				footer={
					<>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHanlder}>
							DELETE
						</Button>
					</>
				}
			>
				<p>Do you want to delete this expense?</p>
				<p>{`${new Date(expenseSelected.timestamp).toLocaleDateString()} ${
					expenseSelected.description
				} $${expenseSelected.amount}`}</p>
			</Modal>
			{isLoading && <LoadingSpinner asOverlay />}
			{!isLoading && loadedExpenses && (
				<ExpensesTable
					expenses={loadedExpenses}
					showDeleteWarningHandler={showDeleteWarningHandler}
					curr={'$ '}
				/>
			)}
			<div className='floating'>
				<IconButton to='/add'>
					<Plus />
				</IconButton>
			</div>
		</>
	)
}

export default MonthlyExpenses
