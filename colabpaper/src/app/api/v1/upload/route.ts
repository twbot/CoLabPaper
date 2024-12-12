import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { UPLOAD_CONFIG } from '@/config/upload';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const projectId = formData.get('projectId') as string;
        const type = formData.get('type') as 'asset' | 'reference';

        if (!file || !projectId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // First verify project access explicitly
        const { data: project, error: projectError } = await supabase
            .from('project')
            .select('id, owner_id')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        // Important: Keep projectId as first path segment for RLS
        const storagePath = `${projectId}/${type}/${timestamp}-${sanitizedName}`;

        console.log('Attempting upload to path:', storagePath); // Debug log

        const { data, error: uploadError } = await supabase.storage
            .from('project-files')
            .upload(storagePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error details:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('project-files')
            .getPublicUrl(storagePath);

        return NextResponse.json({
            status: 'success',
            file: {
                name: file.name,
                path: storagePath,
                url: publicUrl,
                type: file.type
            }
        });

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}