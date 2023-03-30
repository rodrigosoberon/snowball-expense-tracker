import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Auth from './user/pages/Auth'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import MonthlyExpenses from './expenses/pages/MonthlyExpenses'
import AddExpense from './expenses/pages/AddExpense'
import UpdateExpense from './expenses/pages/UpdateExpense'
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook'

function App() {
	const { token, login, logout, userId } = useAuth()
	let routes

	if (token) {
		routes = (
			<Switch>
				<Route path='/' exact>
					<h1>Main authenticated</h1>
				</Route>
				<Route path='/expenses' exact>
					<MonthlyExpenses />
				</Route>
				<Route path='/expenses/:expenseId'>
					<UpdateExpense />
				</Route>
				<Route path='/add'>
					<AddExpense />
				</Route>
				<Redirect to='/' />
			</Switch>
		)
	} else {
		routes = (
			<Switch>
				<Route path='/' exact>
					<h1>Main without auth</h1>
				</Route>
				<Route path='/auth'>
					<Auth />
				</Route>
				<Redirect to='/auth' />
			</Switch>
		)
	}

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				login: login,
				logout: logout
			}}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	)
}

export default App
