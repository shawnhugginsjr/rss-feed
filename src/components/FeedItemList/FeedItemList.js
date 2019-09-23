import React from 'react'
import { FeedItem } from '../FeedItem'
import './styles.css'

export function FeedItemList({ feedItemArray }) {

    const feedItems = []

    for (const [index, item] of feedItemArray.entries()) {
        feedItems.push(<FeedItem key={index} feedItem={item} />)
    }
    return (
        <div className='feed-item-list col-md-8 offset-md-2'>
            {feedItems}
        </div>

    )
}