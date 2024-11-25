'use client'
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FileNameInput from "./FileNameInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FileTypeKey, LatexFileType } from "@/types";
import { LATEX_FILE_TYPES } from "@/constants/latex.constants";

interface CreateFileDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCreateFile: (fileName: string, fileType: FileTypeKey) => Promise<void>;
}

// Helper function to get file type descriptions
function getFileTypeDescription(fileType: string): string {
    const descriptions: Record<string, string> = {
        'tex': 'Main LaTeX document files containing your content and document structure.',
        'cls': 'Class files define document layouts and provide reusable formatting.',
        'sty': 'Style packages contain custom commands and environments.',
        'bib': 'Bibliography databases store reference information for citations.',
        'bst': 'Bibliography style files control citation and reference formatting.',
        'dtx': 'Documented LaTeX sources combine code and documentation.',
        'ins': 'Installation files control package installation and file generation.',
    };
    return descriptions[fileType] || '';
}


const CreateFileDialog: React.FC<CreateFileDialogProps> = ({ isOpen, onOpenChange, onCreateFile }) => {
    const [localFileName, setLocalFileName] = useState('');
    const [localFileType, setLocalFileType] = useState<FileTypeKey>('tex');

    // Prevent form submission from reloading
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Add this to prevent form submission
        try {
            // Add file extension if missing
            let fileName = localFileName;
            const expectedExt = localFileType === 'cls' ? '.cls' : '.tex';
            if (!fileName.endsWith(expectedExt)) {
                fileName += expectedExt;
            }

            await onCreateFile(fileName, localFileType);

            // Only close and reset if successful
            setLocalFileName('');
            setLocalFileType('tex');
            onOpenChange(false);
        } catch (error) {
            console.error('Error creating file:', error);
            // Handle error (show toast, etc.)
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setLocalFileName('');
                    setLocalFileType('tex');
                }
                onOpenChange(open);
            }}
        >
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="fileName">File Name</Label>
                        <FileNameInput
                            value={localFileName}
                            onChange={setLocalFileName}
                            fileType={localFileType}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label>File Type</Label>
                        <div className="flex space-x-4 mt-2">
                            <Button
                                type="button" // Make sure this is type="button"
                                variant={localFileType === 'tex' ? 'default' : 'outline'}
                                onClick={() => setLocalFileType('tex')}
                            >
                                LaTeX Document
                            </Button>
                            <Button
                                type="button" // Make sure this is type="button"
                                variant={localFileType === 'cls' ? 'default' : 'outline'}
                                onClick={() => setLocalFileType('cls')}
                            >
                                Class File
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!localFileName.trim()}
                        >
                            Create File
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default CreateFileDialog