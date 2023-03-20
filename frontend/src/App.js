import React from 'react'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Auth from './user/pages/Auth'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import ExpensesTable from './expenses/ExpensesTable'
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook'
function App() {
  const {token, login, logout, userId } = useAuth()
  let routes

  if(token){
    routes=(
    <Switch>
      <Route path='/' exact>
        <ExpensesTable/>
      </Route>
      <Redirect to='/'/>
    </Switch>
    )
  }else{
    routes=(
    <Switch>
      <Route path='/auth'>
        <Auth/>
      </Route>
      <Redirect to='/auth'/>
    </Switch>
    )
  }

  return <AuthContext.Provider value={{
    isLoggedIn: !!token,
    token: token,
    userId: userId,
    login: login,
    logout:logout
  }}>
    <Router>
      <MainNavigation/>
      <main>{routes}</main>
    </Router>
  </AuthContext.Provider>
}

export default App;
