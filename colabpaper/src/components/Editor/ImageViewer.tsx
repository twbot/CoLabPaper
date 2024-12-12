'use client'
import React, { useEffect, useState } from 'react';
import { FileItem } from '@/types';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ImageViewerProps {
    file: FileItem;
}

const ImageViewer = ({ file }: ImageViewerProps) => {

    const [imageURL, setImageURL] = useState<string | null>(null)

    useEffect(() => {
        const getImagePublicURL = async () => {
            try {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .storage
                    .from('project-files')
                    .createSignedUrl(file.path, 3600); // 1 hour expiry

                if (error) throw error;
                setImageURL(data.signedUrl)
            } catch (error) {
                console.error('Failed to load image URL:', error);
            }
        }
        getImagePublicURL()
    }, [file.path])

    return (
        <>
            {imageURL ?
                <div className="bg-primary/60 h-full flex flex-col justify-center items-center align-middle">
                    <div className="w-3/4 h-full flex flex-col justify-center items-center align-middle">
                        <img
                            src={imageURL}
                            alt={file.name}
                            className="max-w-full max-h-[80vh] object-contain"
                        />
                    </div>
                </div>

                :
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            }
        </>
    );
};

export default ImageViewer;