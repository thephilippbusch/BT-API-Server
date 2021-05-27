import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Header from './components/header'
import LoadHome from './loader/loadHome'

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/">
          <LoadHome />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
