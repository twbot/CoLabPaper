-- Create and configure profiles bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profiles', 'profiles', false, 5242880, '{image/jpeg,image/png,image/webp,image/gif}');

-- Enable RLS
alter table storage.objects enable row level security;

-- Create access policy
create policy "Users can manage their own profile photos"
on storage.objects for all
using (
  bucket_id = 'profiles' 
  and auth.uid()::text = split_part(name, '-', 1)
);