'use client';

import { useState } from 'react';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [targetWidth, setTargetWidth] = useState(0);
    const [targetHeight, setTargetHeight] = useState(0);
    const [resizedImage, setResizedImage] = useState(null);
    const [quality, setQuality] = useState(0.8);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setImagePreview(url);

            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height });
                setTargetWidth(img.width);
                setTargetHeight(img.height);
            };
            img.src = url;
            setResizedImage(null);
        }
    };

    const handleWidthChange = (e) => {
        const width = parseInt(e.target.value) || 0;
        setTargetWidth(width);
        if (maintainAspectRatio && originalDimensions.width > 0) {
            setTargetHeight(Math.round((width / originalDimensions.width) * originalDimensions.height));
        }
    };

    const handleHeightChange = (e) => {
        const height = parseInt(e.target.value) || 0;
        setTargetHeight(height);
        if (maintainAspectRatio && originalDimensions.height > 0) {
            setTargetWidth(Math.round((height / originalDimensions.height) * originalDimensions.width));
        }
    };

    const resizeImage = () => {
        if (!imagePreview) return;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const dataUrl = canvas.toDataURL(file.type, quality);
            setResizedImage(dataUrl);
        };
        img.src = imagePreview;
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <div className="glass-panel p-8">
                {!file ? (
                    <div className="text-center mb-8">
                        <label htmlFor="img-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-gray-500 hover:border-blue-500 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p className="mb-2 text-sm text-gray-400">Upload Image to Resize</p>
                            </div>
                            <input id="img-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Editor Column */}
                        <div className="space-y-6">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h3 className="text-white font-medium mb-4">Resize Settings</h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Width (px)</label>
                                        <input
                                            type="number"
                                            value={targetWidth}
                                            onChange={handleWidthChange}
                                            className="glass-input w-full p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Height (px)</label>
                                        <input
                                            type="number"
                                            value={targetHeight}
                                            onChange={handleHeightChange}
                                            className="glass-input w-full p-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 mb-6">
                                    <input
                                        type="checkbox"
                                        checked={maintainAspectRatio}
                                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                        className="rounded bg-black/20 border-gray-600 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-300">Maintain Aspect Ratio</span>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Quality ({Math.round(quality * 100)}%)</label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.1"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button onClick={resizeImage} className="btn-primary w-full">
                                Resize Image
                            </button>

                            <button onClick={() => {
                                setFile(null);
                                setResizedImage(null);
                            }} className="btn-secondary w-full">
                                Start Over
                            </button>
                        </div>

                        {/* Preview Column */}
                        <div className="space-y-4 text-center">
                            <div>
                                <h4 className="text-sm text-gray-400 mb-2">Original ({originalDimensions.width} x {originalDimensions.height})</h4>
                                <img src={imagePreview} alt="Original" className="max-h-64 mx-auto rounded-lg border border-gray-700" />
                            </div>

                            {resizedImage && (
                                <div className="animate-fade-in">
                                    <h4 className="text-sm text-blue-400 mb-2 mt-6">Resized Result ({targetWidth} x {targetHeight})</h4>
                                    <img src={resizedImage} alt="Resized" className="max-h-64 mx-auto rounded-lg border-2 border-blue-500/50" />
                                    <a
                                        href={resizedImage}
                                        download={`resized_${file.name}`}
                                        className="btn-primary w-full mt-4 inline-block"
                                    >
                                        Download Resized Image
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
