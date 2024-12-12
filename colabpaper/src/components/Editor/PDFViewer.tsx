'use client'
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Loader2 } from 'lucide-react';

// Set worker source path - using a local copy of the worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PDFViewerProps {
    url: string;
}

const PDFViewer = ({ url }: PDFViewerProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);

    const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <div className="h-full overflow-auto flex flex-col items-center bg-muted/50 p-4">
            {/* Controls */}
            <div className="sticky top-0 z-10 flex gap-2 mb-4 bg-background/95 p-2 rounded-lg shadow">
                <button
                    onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                    className="px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded"
                >
                    Zoom Out
                </button>
                <span className="px-2 py-1">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                    className="px-2 py-1 bg-primary/10 hover:bg-primary/20 rounded"
                >
                    Zoom In
                </button>
            </div>

            {/* PDF Document */}
            <Document
                file={url}
                onLoadSuccess={handleLoadSuccess}
                loading={
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                }
                error={
                    <div className="flex items-center justify-center h-full text-destructive">
                        Failed to load PDF. Please try again.
                    </div>
                }
            >
                {/* Render each page */}
                {Array.from(new Array(numPages), (_, index) => (
                    <div key={`page_${index + 1}`} className="mb-4">
                        <Page
                            pageNumber={index + 1}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-lg"
                            loading={
                                <div className="h-[800px] w-[600px] bg-muted animate-pulse" />
                            }
                        />
                    </div>
                ))}
            </Document>

            {/* Page info */}
            {numPages > 0 && (
                <div className="sticky bottom-0 z-10 bg-background/95 px-4 py-2 rounded-lg shadow mt-2">
                    {numPages} page{numPages === 1 ? '' : 's'}
                </div>
            )}
        </div>
    );
};

export default PDFViewer;