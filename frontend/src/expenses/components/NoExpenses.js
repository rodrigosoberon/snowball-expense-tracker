import React from 'react'
import { NavLink } from 'react-router-dom'

import './NoExpenses.css'

const NoExpenses = () => {
	return (
		<div className='no-expenses'>
			<h1>No expenses found!</h1>
			<p>
				Please <NavLink to='/add'>ADD EXPENSE</NavLink>
			</p>
		</div>
	)
}

export default NoExpenses
