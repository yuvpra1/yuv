'use client';

import { useState } from 'react';

export default function MergePdf() {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type === 'application/pdf');
        setPdfFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => {
        setPdfFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === pdfFiles.length - 1)) return;
        const newFiles = [...pdfFiles];
        const temp = newFiles[index];
        newFiles[index] = newFiles[index + direction];
        newFiles[index + direction] = temp;
        setPdfFiles(newFiles);
    };

    const mergePdfs = async () => {
        if (pdfFiles.length < 2) return;
        setIsProcessing(true);
        try {
            const { PDFDocument } = await import('pdf-lib');
            const mergedPdf = await PDFDocument.create();

            for (const file of pdfFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setMergedPdfUrl(url);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Error merging PDFs. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="glass-panel p-8 text-center">
                <div className="mb-8">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-gray-500 hover:border-blue-500 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF files only (max 100MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" accept=".pdf" multiple onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {pdfFiles.length > 0 && (
                    <div className="mb-8 text-left">
                        <h3 className="text-lg font-semibold text-white mb-4">Selected Files ({pdfFiles.length})</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {pdfFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 group hover:bg-white/10 transition-colors">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <div className="flex-shrink-0 w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-red-500">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-300 truncate">{file.name}</span>
                                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => moveFile(index, -1)} disabled={index === 0} className="p-1 hover:text-blue-400 disabled:opacity-30 transition-colors">↑</button>
                                        <button onClick={() => moveFile(index, 1)} disabled={index === pdfFiles.length - 1} className="p-1 hover:text-blue-400 disabled:opacity-30 transition-colors">↓</button>
                                        <button onClick={() => removeFile(index)} className="p-1 hover:text-red-400 transition-colors">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center space-x-4">
                    {/* Clear Button */}
                    {pdfFiles.length > 0 && (
                        <button
                            onClick={() => {
                                setPdfFiles([]);
                                setMergedPdfUrl(null);
                            }}
                            className="btn-secondary"
                        >
                            Clear All
                        </button>
                    )}

                    <button
                        onClick={mergePdfs}
                        disabled={pdfFiles.length < 2 || isProcessing}
                        className="btn-primary flex items-center"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Merging...
                            </>
                        ) : (
                            'Merge PDFs'
                        )}
                    </button>
                </div>

                {mergedPdfUrl && (
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <p className="text-green-400 mb-4">PDFs merged successfully!</p>
                        <a
                            href={mergedPdfUrl}
                            download="merged.pdf"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download Merged PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
