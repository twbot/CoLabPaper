// src/components/Dashboard/DashboardDrawerContainer.tsx
'use client'

import React, { ReactNode, useState } from 'react'
import { TableKey } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardDrawerContainerProps {
    allProjectsComponent: ReactNode
    myProjectsComponent: ReactNode
    sharedProjectsComponent: ReactNode
    archivedProjectsComponent: ReactNode
}

const DashboardDrawerContainer = (props: DashboardDrawerContainerProps) => {
    const [currentTab, setCurrentTab] = useState<TableKey>('all')

    return (
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TableKey)}>
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="self">My Projects</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
                {props.allProjectsComponent}
            </TabsContent>
            <TabsContent value="self" className="space-y-4">
                {props.myProjectsComponent}
            </TabsContent>
            <TabsContent value="shared" className="space-y-4">
                {props.sharedProjectsComponent}
            </TabsContent>
            <TabsContent value="archived" className="space-y-4">
                {props.archivedProjectsComponent}
            </TabsContent>
        </Tabs>
    )
}

export default DashboardDrawerContainer