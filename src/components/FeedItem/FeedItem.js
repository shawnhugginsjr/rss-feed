import React from 'react'
import './style.css'

export function FeedItem({ feedItem }) {
    let title = feedItem.title ? feedItem.title : ''
    let link = feedItem.link ? feedItem.link : '#'
    let imgUrl = feedItem.imageUrl
    let pubDate = feedItem.pubDate ? feedItem.pubDate : 'No Publication Date'
    let content = feedItem.description

    const Image = ({ imageUrl }) => {
        let jsx = (null)

        if (imageUrl) {
            jsx = (
                <img src={imageUrl} ></img>
            )
        }
        return jsx
    }

    return (
        <div className='feed-item row' >
            <div className='col-lg-2 img-container'>
                <Image imageUrl={imgUrl} />
            </div>
            <div className='col-lg-10'>
                <div>
                    <a className='title' href={link} target='_blank'>{title}</a>
                </div>
                <div className='pubdate'>{pubDate}</div>
                <div className='summary'>{content}</div>
            </div>
        </div>
    )
}