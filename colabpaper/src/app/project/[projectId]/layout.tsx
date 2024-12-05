'use client';

import { ProjectProvider } from '@/context/ProjectContext';
import EditorNavbar from '@/components/Editor/EditorNavbar';
import { EditorProvider } from '@/context/EditorContext';

interface ProjectLayoutProps {
    children: React.ReactNode;
    params: { projectId: string };
}

export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
    return (
        <ProjectProvider projectId={params.projectId}>
            <EditorProvider>
                <div className="flex flex-col min-h-screen h-screen bg-background">
                    <EditorNavbar />
                    <main className="flex-grow overflow-auto">
                        <div className="w-full h-full">
                            {children}
                        </div>
                    </main>
                </div>
            </EditorProvider>
        </ProjectProvider>
    );
}