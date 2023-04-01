import React from 'react'
import { NavLink } from 'react-router-dom'

import UnderConstruction from '../images/under-construction.png'
import './Dashboard.css'

const Dashboard = () => {
	return (
		<div className='dashboard'>
			<h1>Dasboard</h1>
			<img src={UnderConstruction} alt='Under construction' />
			<p>Dashboard screen is under construction</p>
			<p>
				Please go to <NavLink to='/expenses'>EXPENSES</NavLink>
			</p>
		</div>
	)
}

export default Dashboard
