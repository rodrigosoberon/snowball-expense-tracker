import React from 'react'

import './IconButton.css'
const IconButton = props => {
	return (
		<button id={props.expenseId} onClick={props.clickHandler}>
			{props.children}
		</button>
	)
}

export default IconButton
