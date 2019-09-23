import React, { useEffect, useState } from 'react'
import { FeedItemList } from '../../components/FeedItemList'
import { UserFeedItemList } from '../../components/UserFeedItemList'
import { RssSearch } from '../../components/RssSearch'
import { Link } from 'react-router-dom'
import './styles.css'
const queryString = require('query-string')

export function Rss({ location, history, user }) {
  const [feed, setFeed] = useState(null)
  const [feedUrl, setFeedUrl] = useState(null)
  const img_mime_type_set = new Set(['image/jpeg', 'image/png'])

  useEffect(() => {
    const queryStrings = queryString.parse(location.search)

    if (!queryStrings.feedUrl) {
      setFeed(null)
      return
    }
    if (queryStrings.feedUrl !== feedUrl) {
      setFeedUrl(queryStrings.feedUrl)
      setFeed(null)
      return
    }

    if (!feed) {
      fetch(`/rss?feedUrl=${queryStrings.feedUrl}`)
        .then((res) => res.json())
        .then((jsonFeed) => {
          prepareFeed(jsonFeed)
          setFeed(jsonFeed)
        })
        .catch((error) => console.log(error))
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

  const searchFeed = (e) => {
    e.preventDefault()
    if (e.keyCode == 13) {
      history.push(`rss?feedUrl=${e.target.value}`)
    }
  }

  return (
    <div>
      <div className='sidebar'>
        <UserSideBar user={user} />
      </div>
      <div className='right-side'>
        <RightContent onEnterHandler={searchFeed} user={user} feed={feed} />
      </div>
    </div>
  )
}

const RightContent = ({ feed, user, onEnterHandler }) => {
  let jsx = (null)
  if (feed) {
    jsx = (
      <div>
        <AuthButtons user={user} />
        <RssSearch onEnterHandler={onEnterHandler} />
        <h2>{feed.title}</h2>
        <span>{`${feed.items.length} Articles / ${feed.imgArticleCount} Article Images`}</span>
        <FeedItemList feedItemArray={feed.items} />
      </div>
    )
  } else {
    jsx = (
      <div>
        <AuthButtons user={user} />
        <RssSearch onEnterHandler={onEnterHandler} />
      </div>
    )
  }
  return jsx
}

const UserSideBar = ({ user }) => {
  let jsx = (null)
  if (user) {
    jsx = (
      <div className='content'>
        <UserFeedItemList userFeedItemArray={user.feeds} />
      </div>
    )
  } else {
    jsx = (
      <div></div>
    )
  }
  return jsx
}

const AuthButtons = ({ user }) => {
  let jsx = (null)
  if (!user) {
    jsx = (
      <div>
        <Link
          className="btn btn-pink"
          role="button"
          to="/signin">
          signin
          </Link>
        <Link
          className="btn btn-pink"
          role="button"
          to="/signup">
          signup
          </Link>
      </div>
    )
  }
  return jsx
} 