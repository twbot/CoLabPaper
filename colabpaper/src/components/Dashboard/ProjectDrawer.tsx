'use client'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import Search from '../ui/search'

interface ProjectDrawerProps {
    drawerName: string
}

const ProjectDrawer = (props: ProjectDrawerProps) => {
    const [searchField, setSearchField] = useState<string>('')

    const onSearchChange = (searchText: string) => {
        setSearchField(searchText)
    }

    return (
        <div className="card-row w-full h-full p-4">
            <div className="flex flex-row justify-start items-start flex-wrap w-full m-0 h-[50px]">
                <span className='text-2xl'>{props.drawerName}</span>
            </div>
            <div className="flex flex-row justify-start items-start flex-wrap w-full m-0 h-[50px]">
                <div className="w-full">
                    <Search onSearchChange={onSearchChange} searchText={searchField} />
                </div>
            </div>
            <div className="container-inset flex flex-row justify-start items-start flex-wrap w-full m-0 h-[calc(100%-100px)] border border-solid border-zinc-400 rounded-sm">
                <div className="h-full w-full overflow-x-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead className="w-[100px]">Last Modified</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">INV001</TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ProjectDrawer