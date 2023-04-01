import React from 'react'

import ExpenseRow from './ExpenseRow'
import NoExpenses from './NoExpenses'
import './ExpensesTable.css'

const ExpensesTable = props => {
	let total = 0
	if (props.expenses.length === 0) {
		return <NoExpenses />
	} else {
		props.expenses.forEach(element => {
			total += element.amount
		})
	}

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Description</th>
						<th>Category</th>
						<th>Amount</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{props.expenses.map(expense => (
						<ExpenseRow
							key={expense.id}
							id={expense.id}
							date={new Date(expense.timestamp).toLocaleDateString()}
							description={expense.description}
							category={expense.category}
							amount={expense.amount}
							curr={props.curr}
							showDeleteWarningHandler={props.showDeleteWarningHandler}
						/>
					))}

					<tr className='total-row'>
						<td />
						<td />
						<td>Total</td>
						<td>{props.curr + (Math.round(total * 100) / 100).toFixed(2)}</td>
						<td />
					</tr>
				</tbody>
			</table>
		</>
	)
}

export default ExpensesTable
