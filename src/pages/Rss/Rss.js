import React, { useEffect, useState } from 'react'
import { FeedItemList } from '../../components/FeedItemList'
import { RssSearch } from '../../components/RssSearch'
const queryString = require('query-string')

export function Rss({ location, history }) {
  const [feed, setFeed] = useState(null)
  const [feedUrl, setFeedUrl] = useState(null)
  const img_mime_type_set = new Set(['image/jpeg', 'image/png'])

  useEffect(() => {
    const queryStrings = queryString.parse(location.search)

    if (!queryStrings.feedUrl) {
      setFeed(null)
    }
    if (queryStrings.feedUrl !== feedUrl) {
      setFeedUrl(queryStrings.feedUrl)
      setFeed(null)
    }

    if (!feed) {
      fetch(`/rss?feedUrl=${queryStrings.feedUrl}`)
        .then((res) => res.json())
        .then((jsonFeed) => {
          prepareFeed(jsonFeed)
          setFeed(jsonFeed)
        })
        .catch((error) => console.log(error))
    } else {
      prepareFeed(feed)
    }
  })

  const searchFeed = (e) => {
    e.preventDefault()
    if (e.keyCode == 13) {
      history.push(`rss?feedUrl=${e.target.value}`)
    }
  }

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
    return (
      <div className='container'>
        <RssSearch onEnterHandler={searchFeed} />
      </div>)
  } else {
    return (
      <div className='container'>
        <RssSearch onEnterHandler={searchFeed} />
        <h2>{feed.title}</h2>
        <span>{reportArticles(feed)}</span>

        <FeedItemList feedItemArray={feed.items} />
      </div>
    )
  }
}