/*
* Sorts a list of feed items to their original positioning.
* Function 'prepareFeed' must be called before using this comparator
* as the 'position' property, which isn't normally on a feed item,
* is added at that time.
*/
const originalCompare = (a, b) => {
    let compare = 0
    if (a.position < b.position) {
        compare = -1
    } else if (a.position > b.position) {
        compare = 1
    }
    return compare
}

/*
* Sorts a list of feed items into alphabetical order by their titles.
*/
const titleCompare = (a, b) => {
    let compare = 0
    if (a.title < b.title) {
        compare = -1
    } else if (a.title > b.title) {
        compare = 1
    }
    return compare
}

/*
* Sorts a list of feed items from most recent to oldest. Function
* 'prepareFeed' must be called before using this comparator as the
* 'date' property, which isn't normally on a feed item, is added at
* that time.
*/
const dateCompare = (a, b) => {
    let compare = 0
    if (a.date < b.date) {
        compare = 1
    } else if (a.date > b.date) {
        compare = -1
    }
    return compare
}

/*
* Sorts a list of feed items by description length. Function
* 'prepareFeed' must be called before using this comparator as the
* 'description' property, which isn't normally on a feed item, is added at
* that time.
*/
const descriptionCompare = (a, b) => {
    let compare = 0
    if (a.description.length < b.description.length) {
        compare = -1
    } else if (a.description.length > b.description.length) {
        compare = 1
    }
    return compare
}

export const sortOptions = ['Original', 'Title', 'Description', 'Date']
export const sortKeys = { original: 0, title: 1, description: 2, pubDate: 3 }
export const sortCompares = { 0: originalCompare, 1: titleCompare, 2: descriptionCompare, 3: dateCompare }
export const sortFeed = (feed, sortKey) => {
    const sortCompare = sortCompares[sortKey]
    feed.items.sort(sortCompare)
}