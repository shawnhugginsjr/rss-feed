import React, { useEffect, useState } from 'react'
import { FeedItemList } from '../../components/FeedItemList'
import { UserFeedItemList } from '../../components/UserFeedItemList'
import { RssSearch } from '../../components/RssSearch'
import { Link } from 'react-router-dom'
import './styles.css'
const queryString = require('query-string')

export function Rss({ location, history, user, setUser }) {
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
          prepareFeed(jsonFeed, queryStrings.feedUrl)
          setFeed(jsonFeed)
        })
        .catch((error) => console.log(error))
    }
  })

  const prepareFeed = (feed, feedUrl) => {
    if (feed.imgArticleCount) {
      return
    }

    feed.imgArticleCount = 0
    feed.feedUrl = feedUrl
    feed.items.forEach((item, index) => {
      if (item.enclosure && img_mime_type_set.has(item.enclosure.type)) {
        feed.imgArticleCount += 1
      } else {
        feed.items[index].enclosure = null
      }
    })
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
        <RightContent onEnterHandler={searchFeed} user={user} feed={feed} setUser={setUser} />
      </div>
    </div>
  )
}

const RightContent = ({ feed, user, setUser, onEnterHandler }) => {
  let jsx = (null)
  if (feed) {
    jsx = (
      <div>
        <AuthButtons user={user} />
        <RssSearch onEnterHandler={onEnterHandler} />
        <div className='feed-title'>{feed.title}</div>
        <div>{`${feed.items.length} Articles / ${feed.imgArticleCount} Article Images`}</div>
        <FollowButton user={user} feed={feed} setUser={setUser} />
        <FeedItemList feedItemArray={feed.items} />
      </div>
    )
  } else {
    jsx = (
      <div>
        <AuthButtons user={user} />
        <RssSearch onEnterHandler={onEnterHandler} />
        <div>Loading...</div>
      </div>
    )
  }
  return jsx
}

const UserSideBar = ({ user }) => {
  console.log(user)
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
        <br />
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

const followFeed = async (feed, user, setUser) => {
  try {
    const feedPayload = {
      feedName: feed.title,
      feedUrl: feed.feedUrl
    }
    
    const res = await fetch('/feed', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(feedPayload)
    })
    
    const body = await res.json()

    if (body.error) {
      console.log(body.error)
      // Display error result to User
      return
    }

    const updatedFeed = [body.feed, ...user.feeds]
    setUser({
      username: user.username,
      feeds: updatedFeed
    })
  } catch (error) {
    console.log(error)
    // Display error result to User
    return
  }
}

const unFollowFeed = async (user, setUser, userFeedIndex) => {
  try {
    const userFeedID = user.feeds[userFeedIndex].id
    console.log('got id')
    const res = await fetch('/feed', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        feedID: userFeedID
      })
    })
    console.log('made post request')
    const body = await res.json()
    if (body.error) {
      console.log(body.error)
      // Display error result to User
      return
    }
    console.log('check error')


    const newUserFeeds = [...user.feeds]
    newUserFeeds.splice(userFeedIndex, 1)
    setUser({
      username: user.username,
      feeds: newUserFeeds
    })
  } catch (error) {
    console.log(error)
    console.log('Feed could not be deleted')
    // Display error result to User
  }
}

const FollowButton = ({ user, feed, setUser }) => {
  let jsx = (null)
  if (user && feed) {
    const foundIndex = user.feeds.findIndex((userFeed) => {
      return userFeed.name === feed.title
    })

    if (foundIndex >= 0) {
      jsx = (
        <button onClick={() => unFollowFeed(user, setUser, foundIndex)}>unFollow</button>
      )
    } else {
      jsx = (
        <button onClick={() => followFeed(feed, user, setUser)}>Follow</button>
      )
    }
  }
  return jsx
}