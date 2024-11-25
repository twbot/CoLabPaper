'use client'
import { TableKey } from '@/types'
import React from 'react'

interface DashboardDrawerLinkProps {
    id: TableKey
    text: string
    active: boolean
    onClick: (e: React.MouseEvent<HTMLLIElement>) => void
}

const DashboardDrawerLink = (props: DashboardDrawerLinkProps) => {
    return (
        <li
            className={`w-full h-[40px] mb-2 p-1 rounded-md btn btn-ghost cursor-pointer ${props.active ? 'bg-accent text-black' : 'text-black'}`}
            onClick={props.onClick}
        >
            <span className='h-full flex flex-row justify-center items-center text-center' id={props.id}>{props.text}</span>
        </li>
    )
}

export default DashboardDrawerLink
