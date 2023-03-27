import React from 'react'

import IconButton from './IconButton'
import { ReactComponent as Trash } from '../../shared/icons/trash.svg'
import { ReactComponent as Edit } from '../../shared/icons/edit.svg'

const ExpenseRow = props => {
	return (
		<tr>
			<td>{props.date}</td>
			<td>{props.description}</td>
			<td>{props.category}</td>
			<td>{props.curr + (Math.round(props.amount * 100) / 100).toFixed(2)}</td>
			<td>
				<IconButton>
					<Edit />
				</IconButton>
				<IconButton>
					<Trash />
				</IconButton>
			</td>
		</tr>
	)
}

export default ExpenseRow
