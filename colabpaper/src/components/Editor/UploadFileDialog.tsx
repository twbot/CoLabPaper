'use client';

import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { cn } from "@/utils/styleHelpers";
import { useToast } from "@/components/ui/use-toast";

interface UploadFileDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    onSuccess?: (type: 'asset' | 'reference') => void;
}

interface UploadedFile {
    name: string;
    url: string;
    path: string;
    type: string;
}

const UploadFileDialog = ({ isOpen, onOpenChange, projectId, onSuccess }: UploadFileDialogProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadType, setUploadType] = useState<'asset' | 'reference'>('asset');
    const { toast } = useToast();

    const allowedTypes = {
        asset: {
            accept: "image/*, .tex, .bib, .cls",
            description: "Images (JPEG, PNG, WebP), LaTeX (.tex), Bibliography (.bib), Class (.cls)"
        },
        reference: {
            accept: "application/pdf, .bib",
            description: "PDF documents (.pdf), Bibliography files (.bib)"
        }
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(droppedFiles);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('projectId', projectId);
                formData.append('type', uploadType);

                const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || `Failed to upload ${file.name}`);
                }
            }

            toast({
                title: 'Success',
                description: `Successfully uploaded ${files.length} file(s)`,
            });

            onSuccess?.(uploadType);
            onOpenChange(false);
            setFiles([]);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to upload files',
                variant: 'destructive'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload files to your project. Supported formats depend on the file type.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpload}>
                    <Tabs defaultValue="asset" onValueChange={(value) => setUploadType(value as 'asset' | 'reference')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="asset">Project Asset</TabsTrigger>
                            <TabsTrigger value="reference">Reference Document</TabsTrigger>
                        </TabsList>

                        <TabsContent value="asset" className="space-y-4">
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors",
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {allowedTypes[uploadType].description}
                                </p>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept={allowedTypes[uploadType].accept}
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="reference" className="space-y-4">
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors",
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {allowedTypes[uploadType].description}
                                </p>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept={allowedTypes[uploadType].accept}
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-muted rounded"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={files.length === 0 || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadFileDialog;