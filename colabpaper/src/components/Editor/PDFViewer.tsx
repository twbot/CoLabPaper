import React from 'react'
import { Document, Page } from 'react-pdf'

interface PDFViewerProps {
    url: string
}
const PDFViewer = (props: PDFViewerProps) => {
    return (
        <div className="h-full overflow-auto">
            <Document file={props.url}>
                <Page pageNumber={1} />
            </Document>
        </div>
    )
}

export default PDFViewer