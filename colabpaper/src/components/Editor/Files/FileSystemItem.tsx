'use client'
import { ChevronDown, ChevronRight, File, FileText, FolderOpen, ImageIcon } from "lucide-react";
import { FileItem, FolderStructure } from "../editor.types";
import { MouseEventHandler } from "react";

interface FileSystemItemProps {
    setFolders: (folder: string) => void
    setSelectedFile: (file: FileItem) => void
    folders: FolderStructure
    file?: FileItem
    selectedFile: FileItem | null
    folder?: string
}

const FileSystemItem = ({ file, folder, folders, selectedFile, setFolders, setSelectedFile }: FileSystemItemProps) => {
    if (folder) {
        const folderName = folder.split('/').pop() || folder;
        const folderData = folders[folder];

        return (
            <div>
                <div
                    className="flex items-center p-2 hover:bg-muted/50 rounded cursor-pointer"
                    onClick={(e: any) => setFolders(folder)}
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
                            <FileSystemItem key={f.path} file={f} setFolders={setFolders} folders={folders} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (!file) return null;

    return (
        <div
            className={`flex items-center p-2 hover:bg-muted/50 rounded cursor-pointer ${selectedFile?.path === file.path ? 'bg-muted' : ''
                }`}
            onClick={() => {
                setSelectedFile(file);
            }}
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
                <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                </p>
            </div>
        </div>
    );
};

export default FileSystemItem