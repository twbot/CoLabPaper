create index profile_email_idx on public.profile using btree (email);
create index profile_username_idx on public.profile using btree (username);
create index project_last_accessed_idx on public.project using btree (last_accessed_at);
create index project_owner_id_idx on public.project using btree (owner_id);
create index project_shares_project_id_idx on public.project_shares using btree (project_id);
create index project_shares_shared_by_idx on public.project_shares using btree (shared_by);
create index project_shares_user_id_idx on public.project_shares using btree (user_id);
create index project_status_idx on public.project using btree (status);
create index temp_profile_user_id_idx on public.temp_profile using btree (user_id);

create trigger update_project_updated_at before update on public.project for each row execute function public.update_updated_at_column();