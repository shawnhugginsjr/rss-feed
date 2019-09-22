import React, { useEffect, useState } from 'react'
const queryString = require('query-string')

export function Rss({ location, history }) {
  const [feed, saveFeed] = useState(null)
  let feedText = ''

  useEffect(() => {
    const queryStrings = queryString.parse(location.search)
    if (!queryStrings.feedUrl) {
      history.replace('/')
    }

    if (!feed) {
      fetch(`/rss?feedUrl=${queryStrings.feedUrl}`)
        .then((res) => res.json())
        .then((jsonFeed) => saveFeed(jsonFeed))
        .catch((error) => console.log(error))
    }
  })

  if (feed) {
    feedText = JSON.stringify(feed)
  } 

  return (
    <div>
      <p>{feedText}</p>
    </div>
  )
}