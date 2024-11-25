'use client'
import React, { ReactNode, useState } from 'react'
import DashboardDrawerLink from './DashboardDrawerLink'
import { TableKey } from '@/types'

interface DashboardDrawerContainerProps {
    allProjectsComponent: ReactNode
    myProjectsComponent: ReactNode
    sharedProjectsComponent: ReactNode
    archivedProjectsComponent: ReactNode
}

const DashboardDrawerContainer = (props: DashboardDrawerContainerProps) => {
    const [currentTab, setCurrentTab] = useState<TableKey>('all')

    const onClickDrawer = (e: React.MouseEvent<HTMLLIElement>) => {
        let element = e.target as HTMLLIElement
        if (element.id !== '') {
            setCurrentTab(element.id as TableKey)
        }
    }

    return (
        <div className="flex flex-row justify-center h-full w-full lg:drawer-open">
            <ul className="card-row bg-slate-300 relative w-80 h-[100%] my-auto text-base-content p-4">
                <div className='w-full flex flex-row justify-center align-middle items-center'>
                    <div className='w-[200px] h-[40px] mb-4 px-3 py-3 rounded-full bg-green-500 flex flex-row justify-center align-middle items-center'>
                        <span className='text-white'>New Project</span>
                    </div>
                </div>
                <DashboardDrawerLink
                    text={'All Projects'}
                    id='all'
                    onClick={onClickDrawer}
                    active={currentTab === 'all'}
                />
                <DashboardDrawerLink
                    text={'My Projects'}
                    id='self'
                    onClick={onClickDrawer}
                    active={currentTab === 'self'}
                />
                <DashboardDrawerLink
                    text={'Shared with you'}
                    id='shared'
                    onClick={onClickDrawer}
                    active={currentTab === 'shared'}
                />
                <DashboardDrawerLink
                    text={'Archived Projects'}
                    id='archived'
                    onClick={onClickDrawer}
                    active={currentTab === 'archived'}
                />
            </ul>
            <div className="flex flex-col items-center justify-center relative w-full">
                {currentTab === 'all' && <>{props.allProjectsComponent}</>}
                {currentTab === 'self' && <>{props.myProjectsComponent}</>}
                {currentTab === 'shared' && <>{props.sharedProjectsComponent}</>}
                {currentTab === 'archived' && <>{props.archivedProjectsComponent}</>}
            </div>
        </div>
    )
}

export default DashboardDrawerContainer
