import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/header'
import LoadHome from './loader/loadHome'
import LoadProfile from './loader/loadProfile'

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <LoadHome />
        </Route>
        <Route
          path="/profile/:pid"
          render={({ match }) => <LoadProfile match={match} />}
        />
      </Switch>
    </Router>
  )
}

export default App
