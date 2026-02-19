'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function ImageConverter() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputImages, setInputImages] = useState([]);
    const [processedImages, setProcessedImages] = useState([]);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Loading FFmpeg core...');

    // Settings
    const [outputFormat, setOutputFormat] = useState('webp');
    const [quality, setQuality] = useState(85);

    const ffmpegRef = useRef(null);

    const loadFFmpeg = async () => {
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        // ... (Listeners same as before)
        ffmpeg.on('log', ({ message }) => setMessage(message));
        ffmpeg.on('progress', ({ progress }) => setProgress(Math.round(progress * 100)));

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
            setMessage('Ready to convert images.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageFiles = files.map((file, index) => ({
            id: index,
            file: file,
            name: file.name,
            preview: URL.createObjectURL(file)
        }));
        setInputImages(imageFiles);
        setProcessedImages([]);
        setProgress(0);
        setMessage(`Selected: ${files.length} images`);
    };

    const convertImages = async () => {
        if (inputImages.length === 0) return;
        setIsLoading(true);
        setMessage('Converting...');
        const ffmpeg = ffmpegRef.current;
        const converted = [];

        try {
            for (let i = 0; i < inputImages.length; i++) {
                const img = inputImages[i];
                setMessage(`Processing ${i + 1}/${inputImages.length}: ${img.name}`);

                await ffmpeg.writeFile('input.png', await fetchFile(img.file));
                const outputName = `output.${outputFormat === 'jpg' ? 'jpg' : outputFormat}`;

                // Logic for quality arguments map (simplified for brevity)
                const qualityArgs = [];
                if (outputFormat === 'webp') qualityArgs.push('-quality', quality.toString());
                if (outputFormat === 'jpg') qualityArgs.push('-q:v', '2'); // simplified

                await ffmpeg.exec(['-i', 'input.png', ...qualityArgs, outputName]);
                const data = await ffmpeg.readFile(outputName);

                const blob = new Blob([data.buffer], { type: `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}` });
                const url = URL.createObjectURL(blob);

                converted.push({
                    id: img.id,
                    originalName: img.name,
                    url: url,
                    size: blob.size,
                    format: outputFormat
                });
                setProgress(Math.round(((i + 1) / inputImages.length) * 100));
            }
            setProcessedImages(converted);
            setMessage('Done!');
        } catch (error) {
            console.error(error);
            setMessage('Failed!');
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const downloadImage = (img) => {
        const a = document.createElement('a');
        a.href = img.url;
        a.download = `${img.originalName.split('.')[0]}.${img.format}`;
        a.click();
    };

    useEffect(() => { loadFFmpeg(); }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="glass-panel p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Image Converter</h2>
                    <p className="text-gray-300">Convert JPG, PNG, WEBP instantly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Upload & List */}
                    <div className="lg:col-span-1 space-y-4">
                        <label className="block w-full border-2 border-dashed border-white/20 hover:border-green-500/50 hover:bg-white/5 rounded-xl p-6 cursor-pointer transition-all text-center">
                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                            <span className="text-green-400 font-bold block">+ Add Images</span>
                        </label>

                        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                            {inputImages.map((img) => (
                                <div key={img.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                    <img src={img.preview} className="w-10 h-10 object-cover rounded" />
                                    <p className="text-xs text-gray-300 truncate flex-1">{img.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Controls & Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-white font-semibold mb-4">Output Settings</h3>
                            <div className="flex gap-4">
                                {['webp', 'jpg', 'png', 'avif'].map(fmt => (
                                    <button
                                        key={fmt}
                                        onClick={() => setOutputFormat(fmt)}
                                        className={`px-4 py-2 rounded-lg uppercase text-sm font-bold transition-all ${outputFormat === fmt ? 'bg-green-600 text-white shadow-lg' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="min-h-[100px]">
                            {processedImages.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {processedImages.map((img) => (
                                        <div key={img.id} className="bg-white/10 p-3 rounded-xl border border-green-500/30">
                                            <p className="text-xs text-gray-300 truncate mb-2">{img.originalName}</p>
                                            <button onClick={() => downloadImage(img)} className="w-full py-1 bg-green-600 text-white text-xs rounded hover:bg-green-500">
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500 italic">
                                    Processed images will appear here
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-8 space-y-4">
                    <button
                        onClick={convertImages}
                        disabled={!loaded || inputImages.length === 0 || isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!loaded || inputImages.length === 0 || isLoading
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? 'Converting...' : `Convert ${inputImages.length} Images`}
                    </button>

                    {processedImages.length > 0 && (
                        <button
                            onClick={() => {
                                setInputImages([]);
                                setProcessedImages([]);
                                setProgress(0);
                                setMessage('Ready to convert images.');
                            }}
                            className="w-full py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white shadow-lg transition-all hover:-translate-y-0.5"
                        >
                            Convert More Images
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
