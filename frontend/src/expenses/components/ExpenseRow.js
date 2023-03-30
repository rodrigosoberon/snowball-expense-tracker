import React from 'react'

import IconButton from './IconButton'
import { ReactComponent as Trash } from '../../shared/icons/trash.svg'
import { ReactComponent as Edit } from '../../shared/icons/edit.svg'

const ExpenseRow = props => {
	const expense = {
		description: props.description,
		category: props.category,
		amount: props.amount
	}

	return (
		<tr>
			<td>{props.date}</td>
			<td>{props.description}</td>
			<td>{props.category}</td>
			<td>{props.curr + (Math.round(props.amount * 100) / 100).toFixed(2)}</td>
			<td>
				<IconButton
					to={{ pathname: `/expenses/${props.id}`, search: `?expense=${JSON.stringify(expense)}` }}
				>
					<Edit />
				</IconButton>
				<IconButton clickHandler={props.showDeleteWarningHandler} expenseId={props.id}>
					<Trash />
				</IconButton>
			</td>
		</tr>
	)
}

export default ExpenseRow
