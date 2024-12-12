'use client'
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface DeleteProjectDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projectName: string;
    projectId: string;
    onConfirmDelete: (projectId: string) => Promise<void>;
}

export default function DeleteProjectDialog({
    isOpen,
    onOpenChange,
    projectName,
    projectId,
    onConfirmDelete
}: DeleteProjectDialogProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmationText !== projectName) return;

        setIsDeleting(true);
        try {
            await onConfirmDelete(projectId);
            onOpenChange(false);
        } finally {
            setIsDeleting(false);
            setConfirmationText('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the project
                        &quot;{projectName}&quot; and all of its files.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6">
                    <p className="text-sm text-muted-foreground mb-2">
                        Please type <span className="font-bold text-foreground">{projectName}</span> to confirm.
                    </p>
                    <Input
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="Enter project name"
                        className={confirmationText && confirmationText !== projectName ? "border-destructive" : ""}
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmationText !== projectName || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            'Delete Project'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}