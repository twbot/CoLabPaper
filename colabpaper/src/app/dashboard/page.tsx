import { useState } from 'react';
import DashboardDrawerContainer from '@/components/Dashboard/DashboardDrawerContainer';
import Navbar from '@/components/Dashboard/Navbar/Navbar';
import CreateProjectDialog from '@/components/Dashboard/CreateProjectDialog';
import { Button } from '@/components/ui/button/index';
import { Plus } from 'lucide-react';

const Dashboard = () => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-base-100">
            <div className="flex flex-col h-full m-2">
                <Navbar />
                <div className="flex items-center justify-between px-4 py-2">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </div>
                <div className="flex-grow">
                </div>
            </div>

            <CreateProjectDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
        </div>
    );
};

export default Dashboard;