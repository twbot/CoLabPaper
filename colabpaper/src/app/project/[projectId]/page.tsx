'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Plus } from "lucide-react";
import CreateFileDialog from '@/components/Editor/CreateFileDialog';
import UploadFileDialog from '@/components/Editor/UploadFileDialog';
import { ThemeSelector } from '@/components/Editor/ThemeSelector';
import { useEditor } from '@/context/EditorContext';
import { useProject } from '@/context/ProjectContext';
import { FileItem } from '@/types';
import FileSystemItem from '@/components/Editor/Files/FileSystemItem';
import { useDocumentSaving } from '@/hooks/useDocumentSaving';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import ImageViewer from '@/components/Editor/ImageViewer';

// Dynamic imports for heavy components
const PDFViewer = dynamic(() => import('@/components/Editor/PDFViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
});
const MonacoEditor = dynamic(() => import('@/components/Editor/EditorWrapper'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

interface ProjectProps {
    params: { projectId: string }
}

const Project: React.FC<ProjectProps> = ({ params }) => {
    const { projectId } = params;
    const { project } = useProject();
    const { applyTheme } = useEditor();
    const { toast } = useToast();

    // State
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('editor');
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
    const [isCreateFileDialogOpen, setIsCreateFileDialogOpen] = useState(false);

    // Custom hooks
    const { folders, isLoading, refreshFiles, setFolders } = useProjectFiles(projectId);
    const {
        content,
        saveState,
        loadDocument,
        updateContent,
        save
    } = useDocumentSaving(projectId);

    // Load initial document
    useEffect(() => {
        loadDocument('main.tex');
    }, [projectId]);

    const handleFileSelect = async (file: FileItem) => {
        try {
            if (file.type === 'tex') {
                await loadDocument(file.name);
            }
            setSelectedFile(file);
            setActiveTab('editor');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load file content",
                variant: "destructive"
            });
        }
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        try {
            // Save before compiling
            await save();

            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    texContent: content,
                    projectId,
                    filename: 'document.pdf',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail?.message || 'Compilation failed');
            }

            const result = await response.json();
            setPdfUrl(result.url);
            toast({
                title: "Success",
                description: "Document compiled successfully",
            });
            await refreshFiles(); // Refresh files after compilation
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Compilation failed",
                variant: "destructive"
            });
        } finally {
            setIsCompiling(false);
        }
    };

    const onSetFolders = (folderPath: string) => {
        setFolders(prev => ({
            ...prev,
            [folderPath]: {
                ...prev[folderPath],
                isOpen: !prev[folderPath].isOpen
            }
        }));
    };

    return (
        <div className='w-full min-h-full h-full'>
            <ResizablePanelGroup direction="horizontal" className='min-h-full h-full'>
                {/* File Browser Panel */}
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col border-r">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold mb-4">Project Files</h2>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setIsCreateFileDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New File
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setIsFileDialogOpen(true)}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload File
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                Object.entries(folders).map(([path, folder]) => (
                                    <FileSystemItem
                                        key={path}
                                        folder={path}
                                        setFolders={onSetFolders}
                                        setSelectedFile={handleFileSelect}
                                        folders={folders}
                                        selectedFile={selectedFile}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={80}>
                    {/* Editor/Preview Panel */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="flex justify-between items-center border-b px-4 py-1">
                            <div className="flex items-center space-x-2">
                                <Button onClick={handleCompile} disabled={isCompiling}>
                                    {isCompiling ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Compiling...
                                        </>
                                    ) : (
                                        'Compile'
                                    )}
                                </Button>
                                {saveState.hasUnsavedChanges && (
                                    <span className="text-sm text-muted-foreground">
                                        Unsaved changes
                                    </span>
                                )}
                            </div>
                            <div className='flex flex-row'>
                                <ThemeSelector onThemeChange={applyTheme} />
                                <TabsList>
                                    <TabsTrigger value="editor">Editor</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <TabsContent value="editor" className="h-full m-0">
                                {selectedFile?.type === 'image' ? (
                                    <ImageViewer file={selectedFile} />
                                ) : (
                                    <MonacoEditor
                                        value={content}
                                        onChange={(newValue) => updateContent(newValue)}
                                    />
                                )}
                            </TabsContent>
                            <TabsContent value="preview" className="h-full m-0">
                                {pdfUrl ? (
                                    <PDFViewer url={pdfUrl} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground">
                                        Compiled PDF will appear here
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>

            {/* Dialogs */}
            <UploadFileDialog
                projectId={projectId}
                isOpen={isFileDialogOpen}
                onOpenChange={setIsFileDialogOpen}
                onSuccess={() => refreshFiles()}
            />

            <CreateFileDialog
                isOpen={isCreateFileDialogOpen}
                onOpenChange={setIsCreateFileDialogOpen}
                onCreateFile={async () => {
                    await refreshFiles();
                }}
            />
        </div>
    );
};

export default Project;