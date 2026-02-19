'use client';

import { useState, useEffect, useRef } from 'react';

export default function MemeGenerator() {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [fontSize, setFontSize] = useState(40);
    const [textColor, setTextColor] = useState('#ffffff');
    const [generatedMeme, setGeneratedMeme] = useState(null);

    const canvasRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setImagePreview(url);
            setGeneratedMeme(null);
        }
    };

    const generateMeme = () => {
        if (!imagePreview || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw Image
            ctx.drawImage(img, 0, 0);

            // Identify Text Style
            ctx.font = `bold ${fontSize}px Impact`;
            ctx.fillStyle = textColor;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = fontSize / 15;
            ctx.textAlign = 'center';

            // Draw Top Text
            ctx.textBaseline = 'top';
            ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
            ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);

            // Draw Bottom Text
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);

            // Generate Output
            const dataUrl = canvas.toDataURL('image/png');
            setGeneratedMeme(dataUrl);
        };
        img.crossOrigin = 'anonymous';
        img.src = imagePreview;
    };

    // Auto-generate preview when inputs change
    useEffect(() => {
        if (imagePreview) {
            generateMeme();
        }
    }, [topText, bottomText, fontSize, textColor]);

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <div className="glass-panel p-8">
                {!file ? (
                    <div className="text-center mb-8">
                        <label htmlFor="meme-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/5 border-gray-500 hover:border-pink-500 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="mb-2 text-sm text-gray-400">Upload Image for Meme</p>
                            </div>
                            <input id="meme-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <div className="bg-white/5 p-4 rounded-lg space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Top Text</label>
                                    <input
                                        type="text"
                                        value={topText}
                                        onChange={(e) => setTopText(e.target.value)}
                                        placeholder="TOP TEXT"
                                        className="glass-input w-full p-2 uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Bottom Text</label>
                                    <input
                                        type="text"
                                        value={bottomText}
                                        onChange={(e) => setBottomText(e.target.value)}
                                        placeholder="BOTTOM TEXT"
                                        className="glass-input w-full p-2 uppercase"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Font Size</label>
                                        <input
                                            type="number"
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value) || 0)}
                                            className="glass-input w-full p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Color</label>
                                        <input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="w-full h-10 rounded cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => {
                                setFile(null);
                                setTopText('');
                                setBottomText('');
                                setGeneratedMeme(null);
                            }} className="btn-secondary w-full">
                                Upload New Image
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="text-center">
                            {generatedMeme && (
                                <div className="space-y-4 mt-6">
                                    <h4 className="text-sm text-gray-400 mb-2">My Meme</h4>
                                    <div className="relative inline-block rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                                        <canvas ref={canvasRef} className="hidden" />
                                        <img src={generatedMeme} alt="Meme Preview" className="max-w-full max-h-[500px]" />
                                    </div>
                                    <a
                                        href={generatedMeme}
                                        download="my-meme.png"
                                        className="btn-primary w-full inline-block"
                                    >
                                        Download Meme
                                    </a>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImagePreview(null);
                                            setTopText('');
                                            setBottomText('');
                                            setGeneratedMeme(null);
                                        }}
                                        className="btn-secondary w-full"
                                    >
                                        Create Another Meme
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
