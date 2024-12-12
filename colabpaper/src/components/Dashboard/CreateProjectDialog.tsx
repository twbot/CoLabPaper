'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client';
interface CreateProjectDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void;
}

const CreateProjectDialog = (props: CreateProjectDialogProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // State
  const [projectName, setProjectName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }

      const { data: project } = await response.json();

      // Create initial LaTeX file
      const supabase = await createClient();
      const initialContent = `\\documentclass{article}
\\usepackage{graphicx} % Required for inserting images
\\title{${projectName}}
\\author{${project.owner?.first_name} ${project.owner?.last_name}}
\\date{${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}}
\\begin{document}
\\maketitle
\\section{Introduction}
\\end{document}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(`${project.id}/tex/main.tex`, initialContent, {
          contentType: 'text/plain',
          upsert: true
        });

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      props.onOpenChange(false);
      router.push(`/project/${project.id}`);
      router.refresh();

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new research project. You can add references and content later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isCreating}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;