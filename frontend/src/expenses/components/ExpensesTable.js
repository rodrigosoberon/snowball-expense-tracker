import React from 'react'

import ExpenseRow from './ExpenseRow'
import './ExpensesTable.css'

const ExpensesTable = props => {
	let total = 0

	if (props.expenses.length === 0) {
		return <p>No expenses found</p>
	} else {
		props.expenses.forEach(element => {
			total += element.amount
		})
	}

	return (
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
						date={new Date(expense.timestamp).toLocaleDateString()}
						description={expense.description}
						category={expense.category}
						amount={expense.amount}
						curr={props.curr}
					/>
				))}

				<tr className='total-row'>
					<td />
					<td />
					<td>Total</td>
					<td>{props.curr + total}</td>
					<td />
				</tr>
			</tbody>
		</table>
	)
}

export default ExpensesTable
