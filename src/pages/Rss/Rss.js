import React, { useEffect, useState } from 'react'
import { FeedItemList } from '../../components/FeedItemList'
const queryString = require('query-string')

export function Rss({ location, history }) {
  const [feed, saveFeed] = useState(null)
  const img_mime_type_set = new Set(['image/jpeg', 'image/png'])

  useEffect(() => {
    const queryStrings = queryString.parse(location.search)
    if (!queryStrings.feedUrl) {
      history.replace('/')
    }

    if (!feed) {
      fetch(`/rss?feedUrl=${queryStrings.feedUrl}`)
        .then((res) => res.json())
        .then((jsonFeed) => {
          prepareFeed(jsonFeed)
          saveFeed(jsonFeed)
        })
        .catch((error) => console.log(error))
    } else {
      prepareFeed(feed)
      console.log(feed)
    }
  })

  const prepareFeed = (feed) => {
    if (feed.imgArticleCount) {
      return
    }

    feed.imgArticleCount = 0
    feed.items.forEach((item, index) => {
      if (item.enclosure && img_mime_type_set.has(item.enclosure.type)) {
        feed.imgArticleCount += 1
      } else {
        feed.items[index].enclosure = null
      }
    })
  }

  const reportArticles = (feed) => {
    return `${feed.items.length} Articles / ${feed.imgArticleCount} Article Images`
  }

  if (!feed) {
    return (<div></div>)
  } else {
    return (
      <div className='container'>
        <h2>{feed.title}</h2>
        <span>{reportArticles(feed)}</span>

        <FeedItemList feedItemArray={feed.items} />
      </div>
    )
  }
}