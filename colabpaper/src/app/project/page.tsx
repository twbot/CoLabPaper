// src/components/Project.tsx
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button/index";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Loader2,
    Upload,
    Plus,
    Save,
    Trash2,
    FolderOpen,
    File,
    ChevronRight,
    ChevronDown,
    FileText,
    Image as ImageIcon
} from "lucide-react";
import { useImageUpload } from '@/hooks/useImageUpload';
import CreateFileDialog from '@/components/Editor/CreateFileDialog';
import { FileTypeKey } from '@/types';
import { LATEX_FILE_TYPES } from '@/constants/latex.constants';

// Dynamically import components
const PDFViewer = dynamic(() => import('@/components/Editor/PDFViewer'), { ssr: false });
const MonacoEditor = dynamic(() => import('@/components/Editor/EditorWrapper'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>
});

interface FileItem {
    name: string;
    path: string;
    url?: string;
    type: FileTypeKey | 'image' | 'pdf';
    size: number;
    content?: string;
    uploadedAt: string;
}

export interface FolderStructure {
    [key: string]: {
        files: FileItem[];
        isOpen: boolean;
    };
}

const Project: React.FC = () => {
    // State Management
    const [latexContent, setLatexContent] = useState<string>('');
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('editor');
    const [folders, setFolders] = useState<FolderStructure>({
        '/': {
            files: [], // Main tex and bib files
            isOpen: true
        },
        '/assets': {
            files: [], // Images
            isOpen: true
        },
        '/classes': {
            files: [], // cls, sty, bst, dtx, ins files
            isOpen: true
        }
    });
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [newFileName, setNewFileName] = useState<string>('');
    const [newFileType, setNewFileType] = useState<'tex' | 'cls'>('tex');
    const [fileContent, setFileContent] = useState<string>('');
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Initialize image upload hook
    const {
        uploadImage,
        isUploading,
        error: uploadError,
        uploadedImages,
    } = useImageUpload({
        projectId: 'default-project',
        onUploadSuccess: (image) => {
            const newFile: FileItem = {
                name: image.file_path.split('/').pop() || 'Unnamed',
                path: `/assets/${image.file_path.split('/').pop()}`,
                url: image.url,
                type: 'image',
                size: image.size,
                uploadedAt: new Date().toISOString(),
            };

            setFolders(prev => ({
                ...prev,
                '/assets': {
                    ...prev['/assets'],
                    files: [...prev['/assets'].files, newFile]
                }
            }));

            // Insert image reference into editor if in editor mode
            if (activeTab === 'editor') {
                const imageLatex = `\\includegraphics{${image.file_path}}\n`;
                setLatexContent(prev => prev + imageLatex);
            }

            toast({
                title: "Image uploaded successfully",
                description: `File: ${newFile.name}`,
            });
        },
    });

    // Fetch all files and organize them
    const fetchAllFiles = async () => {
        try {
            // Fetch all file types
            // TODO: UNCOMMENT AND UPDATE THIS WITH PROJECTID ONCE BACKEND SETUP
            // const [clsResponse, otherFiles] = await Promise.all([
            //     fetch(`/api/cls/${projectId}`),
            //     // Add other file type fetches here
            // ]);

            // const clsData = await clsResponse.json();

            setFolders(prev => ({
                '/': {
                    files: prev['/'].files.filter(f => ['tex', 'bib'].includes(f.type)),
                    isOpen: true
                },
                '/assets': {
                    files: uploadedImages.map(img => ({
                        name: img.file_path.split('/').pop() || 'Unnamed',
                        path: `/assets/${img.file_path.split('/').pop()}`,
                        url: img.url,
                        type: 'image' as const,
                        size: img.size,
                        uploadedAt: new Date().toISOString()
                    })),
                    isOpen: true
                },
                '/classes': {
                    files: [
                        //TODO: UNCOMMENT ONCE BACKEND SETUP
                        // ...clsData.files.map((file: any) => ({
                        //     ...file,
                        //     type: file.name.split('.').pop() as FileTypeKey,
                        //     path: `/classes/${file.name}`
                        // }))
                    ],
                    isOpen: true
                }
            }));
        } catch (error) {
            toast({
                title: "Error fetching files",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive",
            });
        }
    };

    // Load initial files
    useEffect(() => {
        fetchAllFiles();
    }, []);

    // Handle compilation
    const handleCompile = async () => {
        setIsCompiling(true);
        try {
            const response = await fetch('/api/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    texContent: latexContent,
                    projectId: 'default-project',
                    filename: 'document.pdf',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail?.message || 'Compilation failed');
            }

            const result = await response.json();
            setPdfUrl(result.url);

            // Add PDF to files list
            const newFile: FileItem = {
                name: 'document.pdf',
                path: '/' + result.file_path,
                url: result.url,
                type: 'pdf',
                size: 0,
                uploadedAt: new Date().toISOString(),
            };

            setFolders(prev => ({
                ...prev,
                '/': {
                    ...prev['/'],
                    files: [...prev['/'].files.filter(f => f.type !== 'pdf'), newFile]
                }
            }));

            toast({
                title: "Compilation successful",
                description: "PDF has been generated",
            });
        } catch (error) {
            console.error('Error during compilation:', error);
            toast({
                title: "Compilation failed",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive",
            });
        }
        setIsCompiling(false);
    };

    // Toggle folder open/closed
    const toggleFolder = (path: string) => {
        setFolders(prev => ({
            ...prev,
            [path]: {
                ...prev[path],
                isOpen: !prev[path].isOpen
            }
        }));
    };

    // Load file content
    const loadFile = async (file: FileItem) => {
        setSelectedFile(file);

        try {
            if (file.type === 'cls') {
                const response = await fetch(`/api/cls/${file.name}`);
                if (response.ok) {
                    const data = await response.json();
                    setFileContent(data.content);
                }
            } else if (file.type === 'tex') {
                setLatexContent(file.content || '');
            }
            setActiveTab('editor');
        } catch (error) {
            toast({
                title: "Error loading file",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive",
            });
        }
    };

    // Save file
    const saveFile = async () => {
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            const content = selectedFile.type === 'tex' ? latexContent : fileContent;
            const blob = new Blob([content], { type: 'text/plain' });

            if (selectedFile.type === 'cls') {
                formData.append('file', blob, selectedFile.name);
                const response = await fetch(`/api/cls/${selectedFile.name}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to save class file');
                }
            }

            toast({
                title: "File saved",
                description: `Successfully saved ${selectedFile.name}`,
            });

            fetchAllFiles();
        } catch (error) {
            toast({
                title: "Error saving file",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive",
            });
        }
    };

    // Handle image upload
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadImage(file);
        }
    };

    const handleCreateNewFile = async (fileName: string, fileType: FileTypeKey) => {
        try {
            // Add file extension if missing
            let finalFileName = fileName;
            const expectedExt = LATEX_FILE_TYPES[fileType].extension;
            if (!finalFileName.endsWith(expectedExt)) {
                finalFileName += expectedExt;
            }

            // Create default content based on file type
            const content = getTemplateContent(finalFileName, fileType);

            // Handle different file types
            if (['cls', 'sty', 'bst', 'dtx', 'ins'].includes(fileType)) {
                // These files need to be stored in the LaTeX service
                const formData = new FormData();
                const blob = new Blob([content], { type: 'text/plain' });
                formData.append('file', blob, finalFileName);

                const response = await fetch(`/api/latex-file/${fileType}/${finalFileName}`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Failed to create ${fileType} file`);
                }
            } else {
                // These files (tex, bib) can be stored in the project directory
                const newFile: FileItem = {
                    name: finalFileName,
                    path: '/' + finalFileName,
                    type: fileType,  // TypeScript now knows this is a valid file type
                    size: content.length,
                    content: content,
                    uploadedAt: new Date().toISOString(),
                };

                setFolders(prev => ({
                    ...prev,
                    '/': {
                        ...prev['/'],
                        files: [...prev['/'].files, newFile]
                    }
                }));

                // Select the new file for editing
                setSelectedFile(newFile);
                setLatexContent(content);
                setActiveTab('editor');
            }

            toast({
                title: "Success",
                description: `Created ${finalFileName}`,
            });

            setIsDialogOpen(false);
            await fetchAllFiles();

        } catch (error) {
            toast({
                title: "Error creating file",
                description: error instanceof Error ? error.message : "Unknown error occurred",
                variant: "destructive",
            });
        }
    };

    // Helper function to get template content based on file type
    const getTemplateContent = (filename: string, fileType: FileTypeKey): string => {
        const baseName = filename.replace(/\.[^/.]+$/, ''); // Remove extension

        switch (fileType) {
            case 'tex':
                return `\\documentclass{article}
    \\begin{document}
    
    Your content here
    
    \\end{document}`;

            case 'cls':
                return `\\NeedsTeXFormat{LaTeX2e}
    \\ProvidesClass{${baseName}}[${new Date().toISOString().split('T')[0]} v1.0.0 Custom document class]
    
    \\LoadClass[11pt]{article}
    
    % Package requirements
    \\RequirePackage{geometry}
    \\RequirePackage{hyperref}
    
    % Default settings
    \\geometry{margin=1in}
    
    % Custom commands and environments
    % Add your customizations here
    
    \\endinput`;

            case 'sty':
                return `\\NeedsTeXFormat{LaTeX2e}
    \\ProvidesPackage{${baseName}}[${new Date().toISOString().split('T')[0]} v1.0.0 Custom package]
    
    % Package requirements
    \\RequirePackage{xcolor}
    \\RequirePackage{graphicx}
    
    % Package options handling
    \\DeclareOption*{\\PassOptionsToClass{\\CurrentOption}{article}}
    \\ProcessOptions\\relax
    
    % Custom commands and environments
    % Add your customizations here
    
    \\endinput`;

            case 'bib':
                return `% Bibliography Database
    
    @article{example,
        author = {Author Name},
        title = {Example Title},
        journal = {Journal Name},
        year = {${new Date().getFullYear()}},
        volume = {1},
        number = {1},
        pages = {1--10},
        doi = {10.1000/example},
    }
    
    @book{examplebook,
        author = {Book Author},
        title = {Example Book},
        publisher = {Publisher Name},
        year = {${new Date().getFullYear()}},
        address = {City, Country},
        isbn = {000-0-00-000000-0},
    }`;

            case 'bst':
                return `ENTRY
    {
      author
      title
      journal
      year
      volume
      number
      pages
      doi
    }
    {}
    { label }
    
    INTEGERS { output.state before.all }
    
    FUNCTION {init.state.consts}
    { #0 'before.all :=
      #1 'mid.sentence :=
    }
    
    STRINGS { s t }
    
    FUNCTION {output.nonnull}
    { 's :=
      output.state mid.sentence =
        { ", " * write$ }
        { output.state after.block =
            { add.period$ write$
              newline$
            }
            { output.state before.all =
                'write$
                { add.period$ " " * write$ }
              if$
            }
          if$
          mid.sentence 'output.state :=
        }
      if$
      s
    }
    
    % Add more bibliography style definitions here`;

            case 'dtx':
                return `% \\iffalse meta-comment
    %
    % ${baseName}.dtx
    % Copyright (C) ${new Date().getFullYear()} by Your Name
    %
    % This file may be distributed and/or modified under the
    % conditions of the LaTeX Project Public License, either
    % version 1.3c of this license or (at your option) any later
    % version. The latest version of this license is in:
    %
    %    http://www.latex-project.org/lppl.txt
    %
    % \\fi
    %
    % \\iffalse
    %<*driver>
    \\documentclass{ltxdoc}
    \\usepackage{${baseName}}
    \\EnableCrossrefs
    \\CodelineIndex
    \\RecordChanges
    \\begin{document}
      \\DocInput{${baseName}.dtx}
    \\end{document}
    %</driver>
    % \\fi
    %
    % \\section{Usage}
    %
    % \\changes{v1.0.0}{${new Date().toISOString().split('T')[0]}}{First public release}
    %
    % \\StopEventually{}
    %
    % \\section{Implementation}
    %
    %    \\begin{macrocode}
    %<*package>
    \\NeedsTeXFormat{LaTeX2e}
    \\ProvidesPackage{${baseName}}
      [${new Date().toISOString().split('T')[0]} v1.0.0 Package description]
    %    \\end{macrocode}
    %
    % Your implementation here
    %
    %    \\begin{macrocode}
    %</package>
    %    \\end{macrocode}
    \\endinput`;

            case 'ins':
                return `\\input docstrip.tex
    \\keepsilent
    
    \\usedir{tex/latex/${baseName}}
    
    \\preamble
    
    This is a generated file.
    Copyright (C) ${new Date().getFullYear()} by Your Name
    
    This file may be distributed and/or modified under the
    conditions of the LaTeX Project Public License, either
    version 1.3c of this license or (at your option) any later
    version.
    
    \\endpreamble
    
    \\askforoverwritefalse
    \\generate{
      \\file{${baseName}.sty}{\\from{${baseName}.dtx}{package}}
    }
    
    \\endbatchfile`;

            default:
                return '% New file';
        }
    };

    // File/Folder component
    const FileSystemItem = ({ file, folder }: { file?: FileItem; folder?: string }) => {
        if (folder) {
            const folderName = folder.split('/').pop() || folder;
            const folderData = folders[folder];

            return (
                <div>
                    <div
                        className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => toggleFolder(folder)}
                    >
                        {folderData.isOpen ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        <FolderOpen className="h-4 w-4 mr-2" />
                        <span className="text-sm">{folderName}</span>
                    </div>
                    {folderData.isOpen && (
                        <div className="ml-4">
                            {folderData.files.map((f) => (
                                <FileSystemItem key={f.path} file={f} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (!file) return null;

        return (
            <div
                className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${selectedFile?.path === file.path ? 'bg-gray-100' : ''
                    }`}
                onClick={() => loadFile(file)}
            >
                {file.type === 'pdf' ? (
                    <FileText className="h-4 w-4 mr-2" />
                ) : file.type === 'image' ? (
                    <ImageIcon className="h-4 w-4 mr-2" />
                ) : (
                    <File className="h-4 w-4 mr-2" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                    </p>
                </div>
            </div>
        );
    };

    // Update the files section in the return statement
    return (
        <div className='w-full min-h-full h-full'>
            <ResizablePanelGroup direction="horizontal" className='min-h-full h-full'>
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col border-r">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold mb-4">Project Files</h2>
                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    New File
                                </Button>
                                <CreateFileDialog
                                    isOpen={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                    onCreateFile={handleCreateNewFile}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="mr-2 h-4 w-4" />
                                    )}
                                    Upload Image
                                </Button>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {uploadError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{uploadError}</AlertDescription>
                                </Alert>
                            )}
                            {Object.entries(folders).map(([path]) => (
                                <FileSystemItem key={path} folder={path} />
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="border-b px-4">
                            <TabsList>
                                <TabsTrigger value="editor">Editor</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <TabsContent value="editor" className="h-full m-0">
                                <div className="h-full flex flex-col p-4">
                                    {selectedFile?.type === 'cls' ? (
                                        <>
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-lg font-semibold">
                                                    Editing: {selectedFile.name}
                                                </h2>
                                                <Button onClick={saveFile}>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                            <div className="flex-1">
                                                <MonacoEditor
                                                    value={fileContent}
                                                    onChange={setFileContent}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <MonacoEditor
                                                value={latexContent}
                                                onChange={setLatexContent}
                                            />
                                            <div className="mt-4">
                                                <Button
                                                    onClick={handleCompile}
                                                    disabled={isCompiling}
                                                    className="w-full"
                                                >
                                                    {isCompiling ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Compiling...
                                                        </>
                                                    ) : (
                                                        'Compile LaTeX'
                                                    )}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="preview" className="h-full m-0">
                                {pdfUrl ? (
                                    <PDFViewer url={pdfUrl} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        Compiled PDF will appear here
                                    </div>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default Project;