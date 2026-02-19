'use client';

import { useState, useRef, useEffect } from 'react';

export default function PdfToJpg() {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setImages([]);
            setProgress(0);
        }
    };

    const convertToJpg = async () => {
        if (!file) return;
        setIsProcessing(true);
        setImages([]);

        try {
            const pdfjsLib = await import('pdfjs-dist/build/pdf');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const totalPages = pdf.numPages;
            const newImages = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                const imgUrl = canvas.toDataURL('image/jpeg', 0.8);
                newImages.push(imgUrl);
                setProgress(Math.round((i / totalPages) * 100));
            }

            setImages(newImages);
        } catch (error) {
            console.error('Error converting PDF to JPG:', error);
            alert('Error converting PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="glass-panel p-8 text-center">
                {!file ? (
                    <div className="mb-8">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-gray-500 hover:border-blue-500 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload PDF</span></p>
                                </div>
                                <input id="pdf-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg mb-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-red-400">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <span className="text-gray-200 font-medium">{file.name}</span>
                            </div>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-white">Change File</button>
                        </div>

                        {!isProcessing && images.length === 0 && (
                            <button onClick={convertToJpg} className="btn-primary">
                                Convert to JPG
                            </button>
                        )}
                    </div>
                )}

                {isProcessing && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        <p className="text-sm text-gray-400 mt-2">Converting pages... {progress}%</p>
                    </div>
                )}

                {images.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                        {images.map((img, index) => (
                            <div key={index} className="relative group">
                                <img src={img} alt={`Page ${index + 1}`} className="rounded-lg shadow-lg" />
                                <a
                                    href={img}
                                    download={`page-${index + 1}.jpg`}
                                    className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                                >
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
