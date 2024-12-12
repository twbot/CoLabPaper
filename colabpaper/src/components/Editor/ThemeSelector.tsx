// src/components/Editor/ThemeSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { Check, Palette } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/client';
import { EDITOR_THEMES } from '@/constants';
import { EditorTheme } from '@/types';

interface ThemeSelectorProps {
    onThemeChange: (theme: EditorTheme) => void;
}

export function ThemeSelector({ onThemeChange }: ThemeSelectorProps) {
    const [currentTheme, setCurrentTheme] = useState<string>('default-light');

    useEffect(() => {
        const loadTheme = async () => {
            // Try to get theme from localStorage first
            const savedTheme = localStorage.getItem('editor-theme');

            if (savedTheme) {
                setCurrentTheme(savedTheme);
                const theme = EDITOR_THEMES.find(t => t.id === savedTheme);
                if (theme) onThemeChange(theme);
                return;
            }

            //TODO: Add default theme to profile page
            // If no theme in localStorage, try to get from user profile
            // const supabase = createClient();
            // const { data: { user } } = await supabase.auth.getUser();

            // if (user) {
            //     const { data: profile } = await supabase
            //         .from('profile')
            //         .select('editor_theme')
            //         .eq('id', user.id)
            //         .single();

            //     if (profile?.editor_theme) {
            //         setCurrentTheme(profile.editor_theme);
            //         const theme = EDITOR_THEMES.find(t => t.id === profile.editor_theme);
            //         if (theme) onThemeChange(theme);
            //         return;
            //     }
            // }

            // Fall back to default theme
            const defaultTheme = EDITOR_THEMES.find(t => t.id === 'default-light');
            if (defaultTheme) onThemeChange(defaultTheme);
        };

        loadTheme();
    }, [onThemeChange]);

    const handleThemeChange = async (themeId: string) => {
        setCurrentTheme(themeId);
        localStorage.setItem('editor-theme', themeId);

        const theme = EDITOR_THEMES.find(t => t.id === themeId);
        if (!theme) return;

        onThemeChange(theme);

        // Update user preference in database if logged in
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase
                .from('profile')
                .update({ editor_theme: themeId })
                .eq('id', user.id);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='flex flex-row justify-center align-middle items-center px-2'>
                    <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                        <Palette className="h-6 w-6 text-primary" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Editor Theme</DropdownMenuLabel>
                {EDITOR_THEMES.map((theme) => (
                    <DropdownMenuItem
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                    >
                        <Check
                            className={`mr-2 h-4 w-4 ${currentTheme === theme.id ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                        {theme.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}