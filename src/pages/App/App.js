import React, { useState, useEffect } from 'react';
import './App.css';
import { Rss } from '../Rss'
import { Auth } from '../Auth'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'

export function App() {
  const [user, setUser] = useState(null)
  const [needCheckLoginStatus, setNeedCheckLoginStatus] = useState(true)

  useEffect(() => {
    if (needCheckLoginStatus) {
      fetch('/sync')
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          }
          throw 'login failed'
        })
        .then((user) => {
          console.log('logged in')
          setNeedCheckLoginStatus(false)
          setUser(user)
        })
        .catch((error) => {
          setNeedCheckLoginStatus(false)
          console.log(error)
        })
    }
  })


  const NotFound = () => {
    return (
      <div>Not found</div>
    )
  }
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={(props) => <Rss {...props} user={user} />} />
        <Route path='/rss' render={(props) => <Rss {...props} user={user} />} />
        <Route path='/signin' render={(props) => <Auth {...props} mode={'signin'} user={user} handleAuth={setUser} />} />
        <Route path='/signup' render={(props) => <Auth {...props} mode={'signup'} user={user} handleAuth={setUser} />} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}