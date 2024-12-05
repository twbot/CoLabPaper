'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Loader2, Upload } from "lucide-react";

interface Profile {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    profile_image?: string | null;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/profile`);
            if (!response.ok) throw new Error('Failed to fetch profile');
            const { data } = await response.json();
            setProfile(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/profile/photo`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            setProfile(prev => prev ? { ...prev, profile_image: data.url } : null);

            toast({
                title: "Success",
                description: "Profile photo updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload profile photo",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/${process.env.NEXT_PUBLIC_API_VERSION}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: profile.username,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: e.target.value });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative w-20 h-20">
                                {profile?.profile_image ? (
                                    <img
                                        src={profile.profile_image}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="absolute bottom-0 right-0"
                                    onClick={() => document.getElementById('photo-upload')?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                </Button>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div>
                                <h3 className="font-medium">{profile?.first_name} {profile?.last_name}</h3>
                                <p className="text-sm text-muted-foreground">@{profile?.username}</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={profile?.username || ''}
                                    onChange={handleInputChange('username')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={profile?.first_name || ''}
                                    onChange={handleInputChange('first_name')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={profile?.last_name || ''}
                                    onChange={handleInputChange('last_name')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={profile?.email || ''}
                                    disabled
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}