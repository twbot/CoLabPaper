'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/database.types';
import { useToast } from '@/components/ui/use-toast';

interface ProjectContextType {
    project: Project | null;
    setProject: (project: Project) => void;
    isLoading: boolean;
    error: string | null;
    refreshProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({
    children,
    projectId
}: {
    children: React.ReactNode;
    projectId: string;
}) {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchProject = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/v1/projects/${projectId}`);
            if (!response.ok) throw new Error('Failed to fetch project details');

            const { data } = await response.json();
            setProject(data);
            setError(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load project';
            setError(message);
            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    return (
        <ProjectContext.Provider
            value={{
                project,
                setProject,
                isLoading,
                error,
                refreshProject: fetchProject
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}