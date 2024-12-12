import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { FolderStructure, FileItem } from '@/types'
import { INITIAL_FOLDERS } from '@/constants';

// Define initial folders structure


export function useProjectFiles(projectId: string) {
    const [folders, setFolders] = useState<FolderStructure>(INITIAL_FOLDERS);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();
    const { toast } = useToast();

    const fetchProjectFiles = async () => {
        try {
            setIsLoading(true);

            // Fetch files for each folder type
            const newFolders = { ...INITIAL_FOLDERS };

            // Map of folder types to storage paths
            const folderPaths = {
                'tex': 'tex',
                'references': 'reference',
                'assets': 'asset',
                'class': 'cls'
            };

            for (const [folderKey, storagePath] of Object.entries(folderPaths)) {

                const { data: files, error } = await supabase
                    .storage
                    .from('project-files')
                    .list(`${projectId}/${storagePath}`);

                if (error) {
                    console.error(`Error fetching ${folderKey} files:`, error); // Debug log
                    continue;
                }

                if (files) {
                    newFolders[folderKey].files = files.map(file => ({
                        name: file.name,
                        path: `${projectId}/${storagePath}/${file.name}`,
                        type: getFileType(file.name),
                        size: file.metadata?.size || 0,
                        uploadedAt: file.metadata?.lastModified || new Date().toISOString()
                    }));
                }
            }

            setFolders(newFolders);
        } catch (error) {
            console.error('Error in fetchProjectFiles:', error);
            toast({
                title: "Error",
                description: "Failed to load project files",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getFileType = (filename: string): FileItem['type'] => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'tex': return 'tex';
            case 'cls': return 'cls';
            case 'pdf': return 'pdf';
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
                return 'image';
            case 'bib': return 'bib';
            default: return 'unknown';
        }
    };

    // Fetch files when projectId changes
    useEffect(() => {
        if (projectId) {
            fetchProjectFiles();
        }
    }, [projectId]);

    return {
        folders,
        isLoading,
        refreshFiles: fetchProjectFiles,
        setFolders
    };
}