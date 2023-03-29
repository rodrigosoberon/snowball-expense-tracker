import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './ExpenseForm.css'

const AddExpense = () => {
	const auth = useContext(AuthContext)
	const { isLoading, error, sendRequest, clearError } = useHttpClient()
	const [formState, inputHandler] = useForm({
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

	const history = useHistory()

	const expenseSubmitHandler = async event => {
		event.preventDefault()
		try {
			await sendRequest(
				'http://localhost:5000/api/expenses',
				'POST',
				JSON.stringify({
					description: formState.inputs.description.value,
					category: formState.inputs.category.value,
					amount: parseFloat(formState.inputs.amount.value)
				}),
				{
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + auth.token
				}
			)
			history.push('/expenses')
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className='expense-form' onSubmit={expenseSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='description'
					element='input'
					type='text'
					label='Description'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid description.'
					onInput={inputHandler}
				/>
				<Input
					id='category'
					element='input'
					type='text'
					label='Category'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid category.'
					onInput={inputHandler}
				/>
				<Input
					id='amount'
					element='input'
					type='number'
					label='Amount'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid amount.'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					ADD EXPENSE
				</Button>
			</form>
		</>
	)
}

export default AddExpense
