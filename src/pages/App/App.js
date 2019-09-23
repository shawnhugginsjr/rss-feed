import React from 'react';
import './App.css';
import { Rss } from '../Rss'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

export function App() {
  const NotFound = () => {
    return (
      <div>Not found</div>
    )
  }
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Rss} />
        <Route path='/rss' component={Rss} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}