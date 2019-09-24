import React from 'react'
import './style.css'

export function FeedItem({ feedItem }) {
    let title = feedItem.title ? feedItem.title : ''
    let link = feedItem.link ? feedItem.link : null
    let img = feedItem.enclosure ? feedItem.enclosure.url : '#'
    let pubDate = feedItem.pubDate ? feedItem.pubDate : 'No Publication Date'
    let content = ''

    if (feedItem.contentSnippet) {
        content = feedItem.contentSnippet
    } else if (feedItem.description) {
        content = FeedItem.description
    }

    const Image = ({image_url}) => {
        let jsx = (null)
        console.log(image_url)
        if (image_url) {
            const sectionStyle = {
                width: "100px",
                height: "90px",
                backgroundImage: `url(${image_url})`
              }

            jsx = (
                <div style={sectionStyle}></div>
            )
        }
        return jsx
    }

    return (
        <div className='feed-item'>
            <div>
                
            </div>
            <div>
                <div>
                    <a className='title' href={link}>{title}</a>
                </div>
                <div className='pubdate'>{pubDate}</div>
                <div className='summary'>{content}</div>
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