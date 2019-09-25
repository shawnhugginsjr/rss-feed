import React, { useState, useEffect } from 'react'
import './styles.css'

export function RssSearch({ onEnterHandler }) {
    const [searchFeed, setSearchFeed] = useState('')

    const handleChange = (e) => {
        setSearchFeed(e.target.value)
    }

    return (
        <div className='main'>
            <input type='text'
                placeholder='Search for a feed by its RSS link'
                onKeyUp={(event) => {onEnterHandler(event)}}
            />
        </div>
    )
}