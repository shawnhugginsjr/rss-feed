import React, { useEffect, useState } from 'react'
import { FeedItemList } from '../../components/FeedItemList'
import { UserFeedItemList } from '../../components/UserFeedItemList'
import { RssSearch } from '../../components/RssSearch'
import { prepareFeed, sortFeed, sortKeys } from '../../utils/feed'
import { SortDropdown } from '../../components/SortDropdown'
import { Button, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import './styles.css'
const queryString = require('query-string')

export function Rss({ location, history, user, setUser }) {
  const [feed, setFeed] = useState(null)
  const [feedUrl, setFeedUrl] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sort, setSort] = useState(sortKeys.original)

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

  const changeSort = (sortKey) => {
    sortFeed(feed, sortKey)
    setSort(sortKey)
    setFeed(prevFeed => {
      return { ...prevFeed, ...feed }
    })
    console.log('Sorting done ', sortKey)
  }

  const searchFeed = (e) => {
    e.preventDefault()
    if (e.keyCode == 13) {
      history.push(`rss?feedUrl=${e.target.value}`)
    }
  }

  if (!feedUrl) {
    return (
      <div>
        <div className='sidebar'>
          <UserSideBar user={user} setUser={setUser} />
        </div>
        <div className='right-side'>
          <RssSearch onEnterHandler={searchFeed} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='sidebar'>
        <UserSideBar user={user} setUser={setUser} />
      </div>
      <div className='right-side'>
        <RightContent onEnterHandler={searchFeed}
          user={user}
          feed={feed}
          setUser={setUser}
          isOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          changeSort={changeSort}
          sort={sort} />
      </div>
    </div>
  )
}

const RightContent = ({ feed, user, setUser, onEnterHandler, isOpen, setDropdownOpen, changeSort, sort }) => {
  let jsx = (null)
  if (feed) {
    jsx = (
      <div>
        <RssSearch onEnterHandler={onEnterHandler} />
        <div className='feed-title-container'>
          <span className='feed-title'>{feed.title}</span>
          <FollowButton className='follow' user={user} feed={feed} setUser={setUser} />
        </div>
        <div>
          {`${feed.items.length} Articles / ${feed.imgArticleCount} Article Images`}
        </div>
        <div>
          <span>Article Sort Option:</span>
          <SortDropdown isOpen={isOpen} sort={sort} setDropdownOpen={setDropdownOpen} changeSort={changeSort} />
        </div>
        <FeedItemList feedItemArray={feed.items} />
      </div>
    )
  } else {
    jsx = (
      <div>
        <RssSearch onEnterHandler={onEnterHandler} />
        <Spinner size="sm" color="primary" />{' '}
      </div>
    )
  }
  return jsx
}

const UserSideBar = ({ user, setUser }) => {
  let jsx = (null)
  if (user) {
    jsx = (
      <>
        <div className='content'>
          <span className='feed-header'>FEEDS</span>
          <UserFeedItemList userFeedItemArray={user.feeds} />
        </div>
        <div onClick={() => { logout(setUser) }} className='logout'> logout</div>
      </>
    )
  } else {
    jsx = (
      <div className='content'>
        <AuthButtons user={user} />
      </div>
    )
  }
  return jsx
}

const AuthButtons = ({ user }) => {
  let jsx = (null)
  if (!user) {
    jsx = (
      <div>
        <div>
          <Link
            className="btn btn-pink"
            role="button"
            to="/signin">
            Sign In
          </Link>
        </div>
        <div>
          <Link
            className="btn btn-pink"
            role="button"
            to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    )
  }
  return jsx
}

const logout = async (setUser) => {
  try {
    const res = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: null
    })

    const body = await res.json()

    if (body.error) {
      throw body.error
    }

    setUser(null)
  } catch (error) {
    console.log(error)
    // Display an error response to user.
  }
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
        <Button color='primary' size='sm' onClick={() => unFollowFeed(user, setUser, foundIndex)}>Following</Button>
      )
    } else {
      jsx = (
        <Button outline color='secondary' size='sm' onClick={() => followFeed(feed, user, setUser)}>Follow</Button>
      )
    }
  }
  return jsx
}