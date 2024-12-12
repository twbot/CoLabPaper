// src/hooks/useDocumentSaving.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SaveState {
    isSaving: boolean;
    lastSaved: Date | null;
    hasUnsavedChanges: boolean;
}

export function useDocumentSaving(projectId: string) {
    const [activeFile, setActiveFile] = useState('main.tex');
    const [content, setContent] = useState('');
    const [lastSavedContent, setLastSavedContent] = useState('');
    const [saveState, setSaveState] = useState<SaveState>({
        isSaving: false,
        lastSaved: null,
        hasUnsavedChanges: false
    });

    const { toast } = useToast();
    const supabase = createClient();

    // Keep track of save attempts for retry logic
    const saveAttempts = useRef(0);
    const maxSaveAttempts = 3;

    // Load document from backend
    const loadDocument = async (filename: string) => {
        try {
            // First try to load from local storage (for recovery)
            const cachedContent = localStorage.getItem(`doc_${projectId}_${filename}`);

            // Load from backend
            const { data, error } = await supabase.storage
                .from('project-files')
                .download(`${projectId}/tex/${filename}`);

            if (error) throw error;

            const backendContent = await data.text();

            // If cached content is newer (based on local timestamp), use that
            const lastEditTime = localStorage.getItem(`doc_${projectId}_${filename}_lastEdit`);
            const lastSaveTime = localStorage.getItem(`doc_${projectId}_${filename}_lastSave`);

            if (cachedContent && lastEditTime && lastSaveTime &&
                new Date(lastEditTime) > new Date(lastSaveTime)) {
                setContent(cachedContent);
                setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
                toast({
                    title: "Recovered unsaved changes",
                    description: "Your most recent changes have been restored",
                });
            } else {
                setContent(backendContent);
                setLastSavedContent(backendContent);
            }

            setActiveFile(filename);
            return true;
        } catch (error) {
            console.error('Error loading document:', error);
            toast({
                title: "Error",
                description: "Failed to load document. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    };

    // Save to backend with retry logic
    const saveToBackend = async (content: string, filename: string): Promise<boolean> => {
        if (saveState.isSaving) return false;

        try {
            setSaveState(prev => ({ ...prev, isSaving: true }));

            const { error } = await supabase.storage
                .from('project-files')
                .upload(`${projectId}/tex/${filename}`, content, {
                    contentType: 'text/plain',
                    upsert: true
                });

            if (error) throw error;

            setLastSavedContent(content);
            saveAttempts.current = 0;

            // Update save state
            setSaveState({
                isSaving: false,
                lastSaved: new Date(),
                hasUnsavedChanges: false
            });

            // Update local storage
            localStorage.setItem(`doc_${projectId}_${filename}`, content);
            localStorage.setItem(`doc_${projectId}_${filename}_lastSave`, new Date().toISOString());

            return true;
        } catch (error) {
            console.error('Error saving document:', error);

            // Implement retry logic
            if (saveAttempts.current < maxSaveAttempts) {
                saveAttempts.current++;
                setTimeout(() => {
                    saveToBackend(content, filename);
                }, 1000 * saveAttempts.current); // Exponential backoff
            } else {
                toast({
                    title: "Error saving document",
                    description: "Changes will be preserved locally and retry automatically",
                    variant: "destructive"
                });
            }

            setSaveState(prev => ({
                ...prev,
                isSaving: false,
                hasUnsavedChanges: true
            }));

            return false;
        }
    };

    // Handle file rename
    const handleRename = async (oldName: string, newName: string): Promise<boolean> => {
        try {
            // First save current content
            const savedSuccessfully = await saveToBackend(content, newName);
            if (!savedSuccessfully) throw new Error('Failed to save content to new file');

            // Copy old file's metadata and history if needed

            // Delete old file
            const { error } = await supabase.storage
                .from('project-files')
                .remove([`${projectId}/tex/${oldName}`]);

            if (error) throw error;

            // Update active file name
            setActiveFile(newName);

            // Update local storage
            localStorage.removeItem(`doc_${projectId}_${oldName}`);
            localStorage.removeItem(`doc_${projectId}_${oldName}_lastEdit`);
            localStorage.removeItem(`doc_${projectId}_${oldName}_lastSave`);

            return true;
        } catch (error) {
            console.error('Error renaming file:', error);
            toast({
                title: "Error",
                description: "Failed to rename file. Please try again.",
                variant: "destructive"
            });
            return false;
        }
    };

    // Debounced save handler
    const debouncedSave = useCallback(
        debounce((content: string) => {
            if (content !== lastSavedContent) {
                saveToBackend(content, activeFile);
            }
        }, 30000), // 30 second debounce
        [lastSavedContent, activeFile]
    );

    // Update content and trigger saves
    const updateContent = useCallback((newContent: string) => {
        setContent(newContent);
        setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));

        // Save to local storage immediately
        localStorage.setItem(`doc_${projectId}_${activeFile}`, newContent);
        localStorage.setItem(`doc_${projectId}_${activeFile}_lastEdit`, new Date().toISOString());

        // Trigger debounced save
        debouncedSave(newContent);
    }, [projectId, activeFile]);

    // Save before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveState.hasUnsavedChanges) {
                saveToBackend(content, activeFile);
                e.preventDefault();
                e.returnValue = ''; // Required for Chrome
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [content, saveState.hasUnsavedChanges]);

    // Clean up debounced save on unmount
    useEffect(() => {
        return () => {
            debouncedSave.cancel();
        };
    }, [debouncedSave]);

    return {
        activeFile,
        content,
        saveState,
        loadDocument,
        updateContent,
        renameFile: handleRename,
        save: () => saveToBackend(content, activeFile)
    };
}