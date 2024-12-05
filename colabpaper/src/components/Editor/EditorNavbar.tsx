import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useEditor } from '@/context/EditorContext';

const EditorNavbar = () => {
    const router = useRouter();
    const { project, isLoading } = useProject();

    // Common separator component to ensure consistency
    const Separator = () => (
        <div className="h-5 w-[1px] bg-border/50 flex-shrink-0 ml-3 mr-3" />
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-primary">
            <div className="flex h-14 w-full">
                {/* Left section - fixed width matching the file browser */}
                <div className="w-[20%] min-w-[303px] max-w-[303px] border-r-2 border-primary-foreground/50 px-4 flex items-center">
                    <div className="flex items-center gap-2 w-full">
                        {/* Logo & Company Name */}
                        <div className="flex items-center gap-2">
                            <Image
                                src="/CoLabPaper.svg"
                                width={28}
                                height={28}
                                alt="CoLabPaper"
                                className="flex-shrink-0"
                            />
                            <span className="font-bold hidden sm:inline-block text-primary-foreground">CoLabPaper</span>
                        </div>

                        <Separator />

                        {/* Back to Dashboard */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/dashboard')}
                            className="gap-1 flex-shrink-0 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Home
                        </Button>
                    </div>
                </div>

                {/* Right section - fluid width */}
                <div className="flex-1 px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        {isLoading ? (
                            <div className="h-4 w-32 animate-pulse rounded bg-primary-foreground/10"></div>
                        ) : project?.name && (
                            <span className="font-medium truncate text-primary-foreground">{project.name}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default EditorNavbar;