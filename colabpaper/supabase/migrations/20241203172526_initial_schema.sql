create function public.update_updated_at_column() returns trigger
    language plpgsql
    as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create table public.profile (
    id uuid not null,
    email text not null,
    username text not null,
    first_name text not null,
    last_name text not null,
    profile_image text,
    created_at timestamptz not null default now(),
    status text not null default 'active'::text,
    constraint profile_status_check check (status = any (array['active'::text, 'suspended'::text, 'deleted'::text])),
    constraint profile_username_check check (length(username) < 30)
);

create table public.project (
    id uuid default gen_random_uuid() not null,
    name text not null,
    status text not null,
    owner_id uuid not null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    archived_at timestamptz,
    archived_by uuid,
    archive_reason text,
    last_accessed_at timestamptz not null default timezone('utc'::text, now()),
    constraint project_status_check check (status = any (array['active'::text, 'archived'::text]))
);

create table public.project_shares (
    project_id uuid not null,
    user_id uuid not null,
    permission_level text not null,
    shared_at timestamptz not null default timezone('utc'::text, now()),
    shared_by uuid not null,
    constraint project_shares_permission_level_check check (permission_level = any (array['read'::text, 'write'::text, 'admin'::text]))
);

create table public.temp_profile (
    id bigint not null generated by default as identity,
    created_at timestamptz not null default now(),
    first_name text not null,
    last_name text not null,
    username text not null,
    email text not null,
    user_id uuid default gen_random_uuid() not null,
    constraint temp_profile_email_check check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text),
    constraint temp_profile_username_check check (length(username) < 30)
);

alter table only public.profile add constraint profile_email_key unique (email);
alter table only public.profile add constraint profile_pkey primary key (id);
alter table only public.profile add constraint profile_username_key unique (username);
alter table only public.project add constraint project_pkey primary key (id);
alter table only public.project_shares add constraint project_shares_pkey primary key (project_id, user_id);
alter table only public.temp_profile add constraint temp_profile_pkey primary key (id);

alter table only public.profile add constraint profile_id_fkey foreign key (id) references auth.users(id) on delete cascade;
alter table only public.project add constraint project_archived_by_fkey foreign key (archived_by) references auth.users(id);
alter table only public.project add constraint project_owner_id_fkey foreign key (owner_id) references auth.users(id);
alter table only public.project_shares add constraint project_shares_project_id_fkey foreign key (project_id) references public.project(id) on delete cascade;
alter table only public.project_shares add constraint project_shares_shared_by_fkey foreign key (shared_by) references auth.users(id);
alter table only public.project_shares add constraint project_shares_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;