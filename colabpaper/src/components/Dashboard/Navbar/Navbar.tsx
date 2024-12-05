'use Client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="flex flex-1 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/CoLabPaper.svg"
                            width={32}
                            height={32}
                            alt="CoLabPaper"
                        />
                        <span className="font-bold hidden sm:inline-block">CoLabPaper</span>
                    </div>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/settings')}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSignOut}>
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Navbar