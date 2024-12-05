"use client"

import { useEffect, useState } from 'react';
import DashboardDrawerContainer from '@/components/Dashboard/DashboardDrawerContainer';
import Navbar from '@/components/Dashboard/Navbar/Navbar';
import CreateProjectDialog from '@/components/Dashboard/CreateProjectDialog';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import ProjectDrawer from '@/components/Dashboard/ProjectDrawer';
import { createClient } from '@/utils/supabase/client';

export default function Dashboard() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const supabase = await createClient()
            const { data: { user } } = await supabase.auth.getUser()
            console.log(user)
        }
        getUser()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto p-4 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>

                {/* Search */}
                <div className="w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Project Content */}
                <div className="rounded-lg bg-card">
                    <DashboardDrawerContainer
                        allProjectsComponent={<ProjectDrawer drawerName='All Projects' searchFilter={searchQuery} />}
                        myProjectsComponent={<ProjectDrawer drawerName='My Projects' searchFilter={searchQuery} />}
                        sharedProjectsComponent={<ProjectDrawer drawerName='Shared Projects' searchFilter={searchQuery} />}
                        archivedProjectsComponent={<ProjectDrawer drawerName='Archived Projects' searchFilter={searchQuery} />}
                    />
                </div>
            </div>

            <CreateProjectDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </div>
    );
}