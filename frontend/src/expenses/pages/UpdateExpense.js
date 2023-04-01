import React, { useEffect, useContext } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './ExpenseForm.css'

const UpdateExpense = () => {
	const auth = useContext(AuthContext)
	const { error, sendRequest, clearError } = useHttpClient()
	const expenseId = useParams().expenseId
	const history = useHistory()
	const [formState, inputHandler, setFormData] = useForm({
		description: {
			value: '',
			isValid: false
		},
		category: {
			value: '',
			isValid: false
		},
		amount: {
			value: '',
			isValid: false
		}
	})

	const location = useLocation()
	const searchData = new URLSearchParams(location.search)
	const expense = JSON.parse(searchData.get('expense'))

	useEffect(() => {
		setFormData(
			{
				description: {
					value: expense.description,
					isValid: true
				},
				category: {
					value: expense.category,
					isValid: true
				},
				amount: {
					value: parseFloat(expense.amount),
					isValid: true
				}
			},
			true
		)
	}, [expenseId, setFormData, expense.description, expense.category, expense.amount])

	const expenseUpdateHandler = async event => {
		event.preventDefault()
		try {
			await sendRequest(
				`https://snowball-expense-tracker.onrender.com/api/expenses/${expenseId}`,
				'PATCH',
				JSON.stringify({
					description: formState.inputs.description.value,
					category: formState.inputs.category.value,
					amount: parseFloat(formState.inputs.amount.value)
				}),
				{ 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token }
			)
			history.push('/expenses')
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<>
				<ErrorModal error={error} onClear={clearError} />
				<form className='expense-form' onSubmit={expenseUpdateHandler}>
					<Input
						id='description'
						element='input'
						type='text'
						label='Description'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid description.'
						onInput={inputHandler}
						initialValue={expense.description}
						initialValid={true}
					/>
					<Input
						id='category'
						element='input'
						type='text'
						label='Category'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid category.'
						onInput={inputHandler}
						initialValue={expense.category}
						initialValid={true}
					/>
					<Input
						id='amount'
						element='input'
						type='number'
						label='Amount'
						step='.01'
						validators={[VALIDATOR_REQUIRE()]}
						errorText='Please enter a valid amount.'
						onInput={inputHandler}
						initialValue={expense.amount}
						initialValid={true}
					/>
					<Button type='submit' disabled={!formState.isValid}>
						UPDATE EXPENSE
					</Button>
				</form>
			</>
		</>
	)
}

export default UpdateExpense
