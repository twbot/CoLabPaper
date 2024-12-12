import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { MoreHorizontal, File, Share2, Archive, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/types/database.types';
import DeleteProjectDialog from '@/components/Editor/DeleteProjectDialog';

interface ProjectDrawerProps {
    drawerName: string;
    searchFilter?: string;
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ drawerName, searchFilter = '' }) => {
    const router = useRouter();
    const { toast } = useToast();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const responseHealth = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/health`)
            const healthData = await responseHealth.json()

            console.log(healthData)
            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/projects`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            const response = await fetch(
                `/api/${process.env.NEXT_PUBLIC_API_VERSION}/projects/${projectId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete project');
            }

            toast({
                title: "Success",
                description: "Project deleted successfully",
            });

            fetchProjects(); // Refresh the list
        } catch (error) {
            console.error('Error deleting project:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete project",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectClick = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    const handleArchiveProject = async (projectId: string) => {
        try {
            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'archived'
                }),
            });

            if (!response.ok) throw new Error('Failed to archive project');

            toast({
                title: "Success",
                description: "Project archived successfully",
            });

            fetchProjects(); // Refresh the list
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to archive project",
                variant: "destructive",
            });
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchFilter.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProjects.map((project) => (
                        <TableRow
                            key={project.id}
                            className="cursor-pointer"
                            onClick={() => handleProjectClick(project.id)}
                        >
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span>{project.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {project.owner && (
                                    `${project.owner.first_name} ${project.owner.last_name}`
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(project.updated_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/project/${project.id}/share`);
                                        }}>
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            handleArchiveProject(project.id);
                                        }}>
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archive
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setProjectToDelete(project);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filteredProjects.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No projects found
                            </TableCell>
                        </TableRow>
                    )}
                    {projectToDelete && (
                        <DeleteProjectDialog
                            isOpen={isDeleteDialogOpen}
                            onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open);
                                if (!open) setProjectToDelete(null);
                            }}
                            projectName={projectToDelete.name}
                            projectId={projectToDelete.id}
                            onConfirmDelete={handleDeleteProject}
                        />
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ProjectDrawer;