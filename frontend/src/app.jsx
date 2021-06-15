import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import './styles/extend.css'

import LoadHome from './loader/loadHome'
import LoadPost from './loader/loadPost'
import LoadProfile from './loader/loadProfile'
import LoadSettings from './loader/loadSettings'
import LoadSearch from './loader/loadSearch'

import Login from './pages/login'
import SignUp from './pages/signup'
import Header from './components/header'

import { AuthContext, CurrentUserContext } from './context'

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem('userToken')
  )

  const setToken = (data) => {
    localStorage.setItem('authToken', data)
    setAuthToken(data)
  }

  const setUser = (data) => {
    localStorage.setItem('userToken', data)
    setCurrentUser(data)
  }

  return (
    <Router>
      <CurrentUserContext.Provider
        value={{ currentUser, setCurrentUser: setUser }}
      >
        <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
          <div className="h-screen">
            <Header />
            <div className="body">
              <Switch>
                <Route exact path="/">
                  <LoadHome />
                </Route>
                <Route path="/login">
                  <Login />
                </Route>
                <Route path="/signup">
                  <SignUp />
                </Route>
                <Route
                  path="/profile/:uid"
                  render={({ match }) => <LoadProfile match={match} />}
                />
                <Route
                  path="/post/:pid"
                  render={({ match }) => <LoadPost match={match} />}
                />
                <Route path="/search">
                  <LoadSearch />
                </Route>
                {authToken && currentUser ? (
                  <Route path="/settings">
                    <LoadSettings />
                  </Route>
                ) : (
                  <Redirect to="/login" />
                )}
              </Switch>
            </div>
          </div>
        </AuthContext.Provider>
      </CurrentUserContext.Provider>
    </Router>
  )
}

export default App
