import React from 'react'
import { NavLink } from 'react-router-dom'

import './Welcome.css'

const Welcome = () => {
	return (
		<div className='welcome'>
			<img src='./snowman.png' alt='Snowman logo' />
			<h1>Welcome to</h1>
			<h1 className='title'>Snowball Expense Tracker</h1>
			<p>
				Please <NavLink to='/auth'>AUTHENTICATE</NavLink>
			</p>
		</div>
	)
}

export default Welcome
