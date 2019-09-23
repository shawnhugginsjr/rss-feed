import React from 'react'
import './style.css'

export function FeedItem({ feedItem }) {
    let title = feedItem.title ? feedItem.title : ''
    let link = feedItem.link ? feedItem.link : '#'
    let img = feedItem.enclosure ? feedItem.enclosure.url : '#'
    let pubDate = feedItem.pubDate ? feedItem.pubDate : 'No Publication Date'
    let content = ''

    if (feedItem.contentSnippet) {
        content = feedItem.contentSnippet
    } else if (feedItem.description) {
        content = FeedItem.description
    }

    return (
        <div className='feed-item row'>
            <div className='col-md-3'></div>
            <div className="content col-md-9">
                <div>
                    <a href={link}>{title}</a>
                </div>
                <div>{pubDate}</div>
                <p>{content}</p>
            </div>
        </div>
    )
}

/*
FeedItem Schema
Contenet and enclosure may not exist


"title": "Hubble Takes Closer Look at Not-So-'Dead' Neighbor",
"link": "http://www.nasa.gov/image-feature/goddard/2019/hubble-takes-closer-look-at-not-so-dead-neighbor",
"content": "",
"pubDate": "Fri, 20 Sep 2019 09:27 EDT",
"enclosure": { (may no)
    "url": "http://www.nasa.gov/sites/default/files/thumbnails/image/potw1937a.jpg",
    "length": "919436",
    "type": "image/jpeg"
   },
*/