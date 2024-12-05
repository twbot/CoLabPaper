-- Drop existing foreign keys
ALTER TABLE public.project_shares
DROP CONSTRAINT IF EXISTS project_shares_user_id_fkey,
DROP CONSTRAINT IF EXISTS project_shares_shared_by_fkey;

-- Add new foreign keys referencing profile table
ALTER TABLE public.project_shares
ADD CONSTRAINT project_shares_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profile(id)
ON DELETE CASCADE;

ALTER TABLE public.project_shares
ADD CONSTRAINT project_shares_shared_by_fkey
FOREIGN KEY (shared_by) REFERENCES public.profile(id);

-- Update indexes to match the new relationships
DROP INDEX IF EXISTS project_shares_user_id_idx;
DROP INDEX IF EXISTS project_shares_shared_by_idx;
CREATE INDEX project_shares_user_id_idx ON public.project_shares(user_id);
CREATE INDEX project_shares_shared_by_idx ON public.project_shares(shared_by);