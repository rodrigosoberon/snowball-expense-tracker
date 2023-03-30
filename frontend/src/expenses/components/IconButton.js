import React from 'react'
import { Link } from 'react-router-dom'

import './IconButton.css'
const IconButton = props => {
	if (props.to) {
		return <Link to={props.to}>{props.children}</Link>
	}
	return (
		<button id={props.expenseId} onClick={props.clickHandler} to={props.to}>
			{props.children}
		</button>
	)
}

export default IconButton
