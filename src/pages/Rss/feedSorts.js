const originalCompare = (a, b) => {
    let compare = 0
    if (a.title < b.title) {
        compare = -1
    } else if (a.title > b.title) {
        compare = 1
    }
    return compare
}

const titleCompare = (a, b) => {
    let compare = 0
    if (a.title < b.title) {
        compare = -1
    } else if (a.title > b.title) {
        compare = 1
    }
    return compare
}

const dateCompare = (a, b) => {
    let compare = 0
    if (a.date < b.date) {
        compare = 1
    } else if (a.date > b.date) {
        compare = -1
    }
    return compare
}

const descriptionCompare = (a, b) => {
    let compare = 0

    return compare
}

export const sortKeys = { original: 0, title: 1, description: 2, pubDate: 3 }
export const sortCompares = { 0: originalCompare, 1: titleCompare, 2: descriptionCompare, 3: dateCompare }
export const sortFeed = (feed, sortKey) => {
    const sortCompare = sortCompares[sortKey]
    if (feed.sort != sortKey) {
        feed.sort = sortKey
        const newItems = feed.items.slice(0)
        newItems.sort(sortCompare)
        feed.items = newItems
    }
}