// src/app/api/v1/profile/photo/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the file from request
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            return NextResponse.json({ error: 'File too large' }, { status: 400 });
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(`photos/${fileName}`, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(`photos/${fileName}`);

        // Update profile with new photo URL
        const { error: updateError } = await supabase
            .from('profile')
            .update({ profile_image: publicUrl })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return NextResponse.json({
            url: publicUrl
        });

    } catch (error) {
        console.error('Profile photo upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload photo' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update profile to remove photo URL
        const { error: updateError } = await supabase
            .from('profile')
            .update({ profile_image: null })
            .eq('id', user.id);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error('Profile photo deletion error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete photo' },
            { status: 500 }
        );
    }
}