import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { sortOptions, sortKeys } from '../../utils/feed'

export function SortDropdown({isOpen, setDropdownOpen, sort, changeSort}) {
    return (
        <>
            <Dropdown size='sm' isOpen={isOpen} toggle={() => { setDropdownOpen(prevState => { return !prevState }) }}>
                <DropdownToggle caret>
                    {sortOptions[sort]}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={() => changeSort(sortKeys.original)}>Original</DropdownItem>
                    <DropdownItem onClick={() => changeSort(sortKeys.title)} >Title</DropdownItem>
                    <DropdownItem onClick={() => changeSort(sortKeys.description)} >Description Length</DropdownItem>
                    <DropdownItem onClick={() => changeSort(sortKeys.pubDate)} >Date</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}