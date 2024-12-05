import { ArrowRight, Code, BookText, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SplashPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="flex flex-1 items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* <BookText className="h-6 w-6" /> */}
                            <Image src={'/CoLabPaper.svg'} alt="CoLabPaper Icon" width={30} height={30} />
                            <span className="font-bold">CoLabPaper</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" asChild>
                                <a href="/signin">Sign In</a>
                            </Button>
                            <Button asChild>
                                <a href="/signup">Get Started</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container flex flex-col items-center justify-center gap-4 pt-32 pb-8 md:pt-40 text-center">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                    Write Research Papers <br />
                    <span className="text-primary">Powered by AI</span>
                </h1>
                <p className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
                    Seamlessly integrate references, code, and AI-generated content.
                    Write faster and smarter with intelligent assistance.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" asChild>
                        <a href="/signup">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                    <Button size="lg" variant="outline">
                        <a href="https://github.com/yourusername/colabpaper" target="_blank" rel="noopener noreferrer" className="flex flex-row justify-center items-center align-middle">
                            <div className="mr-2 h-6 w-6 flex flex-row justify-center align-middle items-center rounded-full border border-primary">
                                <Github className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-primary">Star on GitHub</span>
                        </a>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <Code className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Code Integration</h3>
                        <p className="mt-2 text-muted-foreground">
                            Seamlessly include code from GitHub repositories with automatic syntax highlighting.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <BookText className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">Reference Management</h3>
                        <p className="mt-2 text-muted-foreground">
                            Import and manage references with ease. Automatic citation formatting in any style.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                            <Sparkles className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">AI Writing Assistant</h3>
                        <p className="mt-2 text-muted-foreground">
                            Generate sections, improve writing, and get intelligent suggestions as you write.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t mt-auto">
                <div className="container flex h-14 items-center">
                    <p className="text-sm text-muted-foreground">
                        Built with ❤️ by researchers, for researchers.
                    </p>
                </div>
            </footer>
        </div>
    );
}