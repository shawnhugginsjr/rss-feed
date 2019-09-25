import React from 'react'
import { Link } from 'react-router-dom'
import './styles.css'

export function UserFeedItem({ userFeedItem }) {

    return (
        <div className='user-item-wrapper'>
            <Link role={'button'} to={`rss?feedUrl=${userFeedItem.url}`}>
                <span className='feed-name'>{userFeedItem.name}</span>
            </Link>
        </div>
    )
}