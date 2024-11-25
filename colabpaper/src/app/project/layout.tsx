import EditorNavbar from '@/components/Navbar/editor-navbar'
import React from 'react'

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-screen flex flex-col">
            <EditorNavbar />
            <main className="flex-grow overflow-auto">
                <div className="w-full h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}