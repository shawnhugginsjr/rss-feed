import React from 'react'
import { Link } from 'react-router-dom'
export function UserFeedItem({ userFeedItem }) {

    return (
        <div>
            <Link role={'button'} to={`rss?feedUrl=${userFeedItem.url}`}>
                {userFeedItem.name}
            </Link>
        </div>
    )
}