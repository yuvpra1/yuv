'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function VideoCompressor() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Loading FFmpeg core...');
    const [quality, setQuality] = useState('medium');
    const [resolution, setResolution] = useState('original');
    const ffmpegRef = useRef(null);

    const loadFilter = async () => {
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;

        ffmpeg.on('log', ({ message }) => {
            setMessage(message);
            console.log(message);
        });

        ffmpeg.on('progress', ({ progress }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
            setMessage('Ready to compress! Select a video.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Please refresh.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVideoFile(file);
        setCompressedUrl(null);
        setProgress(0);
        setMessage(`Selected: ${file.name}`);
    };

    const getCompressionSettings = () => {
        const settings = {
            high: { crf: '23', preset: 'medium' },
            medium: { crf: '28', preset: 'fast' },
            low: { crf: '35', preset: 'veryfast' }
        };
        return settings[quality];
    };

    const getResolutionFilter = () => {
        const resolutions = {
            original: null,
            '1080p': 'scale=-2:1080',
            '720p': 'scale=-2:720',
            '480p': 'scale=-2:480'
        };
        return resolutions[resolution];
    };

    const compressVideo = async () => {
        if (!videoFile) return;
        setIsLoading(true);
        setMessage('Compressing video...');
        const ffmpeg = ffmpegRef.current;

        try {
            await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

            const { crf, preset } = getCompressionSettings();
            const scaleFilter = getResolutionFilter();

            const args = [
                '-i', 'input.mp4',
                '-c:v', 'libx264',
                '-crf', crf,
                '-preset', preset,
                '-c:a', 'aac',
                '-b:a', '128k'
            ];

            if (scaleFilter) {
                args.push('-vf', scaleFilter);
            }

            args.push('output.mp4');

            await ffmpeg.exec(args);
            const data = await ffmpeg.readFile('output.mp4');

            const url = URL.createObjectURL(
                new Blob([data.buffer], { type: 'video/mp4' })
            );
            setCompressedUrl(url);
            setMessage('Compression Complete!');
        } catch (error) {
            console.error(error);
            setMessage('Compression Failed!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFilter();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Video Compressor</h2>
                    <p className="text-gray-300">Reduce file size without losing quality.</p>
                </div>

                {/* Upload Area */}
                <div className="mb-8">
                    <label className={`block w-full border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${videoFile ? 'border-orange-500/50 bg-orange-500/10' : 'border-white/20 hover:border-orange-500/50 hover:bg-white/5'}`}>
                        <input type="file" onChange={handleFileUpload} accept="video/*" className="hidden" />
                        {videoFile ? (
                            <div className="text-center text-orange-400">
                                <p className="font-medium truncate max-w-xs mx-auto">{videoFile.name}</p>
                                <p className="text-sm opacity-75 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <p className="font-medium">Click to upload video</p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
                        <select
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                            className="glass-input w-full p-3"
                        >
                            <option value="high" className="text-black">High Quality (Larger size)</option>
                            <option value="medium" className="text-black">Balanced</option>
                            <option value="low" className="text-black">Max Compression (Low Quality)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Resolution</label>
                        <select
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            className="glass-input w-full p-3"
                        >
                            <option value="original" className="text-black">Original</option>
                            <option value="1080p" className="text-black">1080p Full HD</option>
                            <option value="720p" className="text-black">720p HD</option>
                            <option value="480p" className="text-black">480p SD</option>
                        </select>
                    </div>
                </div>

                {/* Status & Progress */}
                <div className="mb-8 min-h-[40px]">
                    {isLoading ? (
                        <div className="w-full bg-white/10 rounded-full h-4 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    ) : null}
                    <p className="text-sm text-center text-gray-300 animate-pulse">{message}</p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={compressVideo}
                        disabled={!loaded || !videoFile || isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!loaded || !videoFile || isLoading
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95'
                            }`}
                    >
                        {isLoading ? 'Compressing...' : 'Compress Video'}
                    </button>

                    {compressedUrl && (
                        <div className="space-y-4">
                            <a
                                href={compressedUrl}
                                download={`compressed_${videoFile?.name}`}
                                className="block w-full py-4 rounded-xl font-bold text-lg bg-green-600 hover:bg-green-500 text-white text-center shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5"
                            >
                                Download Compressed Video
                            </a>
                            <button
                                onClick={() => {
                                    setVideoFile(null);
                                    setCompressedUrl(null);
                                    setProgress(0);
                                    setMessage('Ready to compress! Select a video.');
                                }}
                                className="block w-full py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                Compress Another Video
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
