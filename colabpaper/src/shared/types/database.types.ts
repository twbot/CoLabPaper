// src/shared/types/database.types.ts

export interface Profile {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image?: string;
    created_at: string;
    status: 'active' | 'suspended' | 'deleted';
}

export interface ProjectShare {
    project_id: string;
    user_id: string;
    permission_level: 'read' | 'write' | 'admin';
    shared_at: string;
    shared_by: string;
    user?: Profile;
}

export interface Project {
    id: string;
    name: string;
    status: 'active' | 'archived';
    owner_id: string;
    created_at: string;
    updated_at: string;
    archived_at?: string;
    archived_by?: string;
    archive_reason?: string;
    last_accessed_at: string;
    // Relations
    owner?: Profile;  // Updated to use Profile directly
    shares?: ProjectShare[];
}