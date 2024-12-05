-- First, drop the existing foreign key constraint
ALTER TABLE public.project
DROP CONSTRAINT IF EXISTS project_owner_id_fkey;

-- Add new foreign key constraint to profile table
ALTER TABLE public.project
ADD CONSTRAINT project_owner_id_fkey
FOREIGN KEY (owner_id) REFERENCES public.profile(id)
ON DELETE CASCADE;

-- Update existing indexes if needed
DROP INDEX IF EXISTS project_owner_id_idx;
CREATE INDEX project_owner_id_idx ON public.project(owner_id);

-- Since profile is already linked to auth.users with ON DELETE CASCADE,
-- deleting a user will cascade through profile to projects automatically