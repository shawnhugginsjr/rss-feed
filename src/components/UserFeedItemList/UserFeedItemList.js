import React from 'react'
import { FeedItem } from '../FeedItem'
import './styles.css'
import {UserFeedItem} from '../UserFeedItem'

export function UserFeedItemList({ userFeedItemArray }) {

    const feedItems = []

    for (const [index, item] of userFeedItemArray.entries()) {
        feedItems.push(<UserFeedItem key={index} userFeedItem={item} />)
    }
    return (
        <div className='feed-item-list'>
            {feedItems}
        </div>

    )
}