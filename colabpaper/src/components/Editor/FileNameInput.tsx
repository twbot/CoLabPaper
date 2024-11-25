// components/FileNameInput.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FileTypeKey } from '@/types';
import { LATEX_FILE_TYPES } from '@/constants/latex.constants';

interface FileNameInputProps {
    value: string;
    onChange: (value: string) => void;
    fileType: FileTypeKey;
    className?: string;
    placeholder?: string;
}

const FileNameInput: React.FC<FileNameInputProps> = ({
    value,
    onChange,
    fileType,
    className = '',
    placeholder
}) => {
    const [baseName, setBaseName] = useState('');
    const extension = LATEX_FILE_TYPES[fileType].extension;

    useEffect(() => {
        const withoutExt = value.replace(new RegExp(`${extension}$`), '');
        setBaseName(withoutExt);
    }, [value, extension]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBaseName = e.target.value;
        setBaseName(newBaseName);
        onChange(newBaseName);
    };

    return (
        <div className={`relative ${className}`}>
            <Input
                value={baseName}
                onChange={handleChange}
                className="pr-12"
                placeholder={placeholder}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {extension}
            </div>
        </div>
    );
};

export default FileNameInput;