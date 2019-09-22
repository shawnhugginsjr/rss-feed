import React, { useEffect } from 'react'
const queryString = require('query-string')

export function Rss({ location, history }) {
  useEffect(() => {
    const queryStrings = queryString.parse(location.search)
    if (queryStrings.feedUrl === undefined) {
      history.replace('/')
    }
  })

  return (
    <div>Rss page</div>
  )
}