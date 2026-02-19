'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function AudioEditor() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioFiles, setAudioFiles] = useState([]);
    const [outputUrl, setOutputUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Loading FFmpeg core...');
    const [operation, setOperation] = useState('trim');

    // Trim controls
    const [startTime, setStartTime] = useState('0');
    const [endTime, setEndTime] = useState('10');

    // Volume control
    const [volume, setVolume] = useState(100);

    // Fade controls
    const [fadeInDuration, setFadeInDuration] = useState('0');
    const [fadeOutDuration, setFadeOutDuration] = useState('0');

    const ffmpegRef = useRef(null);

    const loadFFmpeg = async () => {
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
            setMessage('Ready to edit audio!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Check console.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAudioFiles(files);
        setOutputUrl(null);
        setProgress(0);
        setMessage(`Selected: ${files.length} file(s)`);
    };

    const processAudio = async () => {
        if (audioFiles.length === 0) return;
        setIsLoading(true);
        setMessage('Processing audio...');
        const ffmpeg = ffmpegRef.current;

        try {
            if (operation === 'merge' && audioFiles.length > 1) {
                // Merge multiple audio files
                for (let i = 0; i < audioFiles.length; i++) {
                    await ffmpeg.writeFile(`input${i}.mp3`, await fetchFile(audioFiles[i]));
                }

                // Create concat file list
                const concatList = audioFiles.map((_, i) => `file 'input${i}.mp3'`).join('\n');
                await ffmpeg.writeFile('concat.txt', concatList);

                await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', 'output.mp3']);
            } else {
                // Single file operations
                await ffmpeg.writeFile('input.mp3', await fetchFile(audioFiles[0]));

                const args = ['-i', 'input.mp3'];
                const filters = [];

                if (operation === 'trim') {
                    args.push('-ss', startTime, '-to', endTime);
                } else if (operation === 'volume') {
                    filters.push(`volume=${volume / 100}`);
                } else if (operation === 'fade') {
                    if (parseFloat(fadeInDuration) > 0) {
                        filters.push(`afade=t=in:st=0:d=${fadeInDuration}`);
                    }
                    if (parseFloat(fadeOutDuration) > 0) {
                        const start = parseFloat(endTime) - parseFloat(fadeOutDuration);
                        filters.push(`afade=t=out:st=${start}:d=${fadeOutDuration}`);
                    }
                } else if (operation === 'all') {
                    // Apply all effects
                    args.push('-ss', startTime, '-to', endTime);
                    filters.push(`volume=${volume / 100}`);
                    if (parseFloat(fadeInDuration) > 0) {
                        filters.push(`afade=t=in:st=0:d=${fadeInDuration}`);
                    }
                    if (parseFloat(fadeOutDuration) > 0) {
                        const duration = parseFloat(endTime) - parseFloat(startTime);
                        const start = duration - parseFloat(fadeOutDuration);
                        filters.push(`afade=t=out:st=${start}:d=${fadeOutDuration}`);
                    }
                }

                if (filters.length > 0) {
                    args.push('-af', filters.join(','));
                }

                args.push('output.mp3');
                await ffmpeg.exec(args);
            }

            const data = await ffmpeg.readFile('output.mp3');
            const url = URL.createObjectURL(
                new Blob([data.buffer], { type: 'audio/mp3' })
            );
            setOutputUrl(url);
            setMessage('Processing Complete!');
        } catch (error) {
            console.error(error);
            setMessage('Processing Failed!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="glass-panel p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Audio Editor</h2>
                    <p className="text-gray-300">Cut, trim, and mix your audio tracks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Input */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">1. Select Files</h3>
                            <label className={`block w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${audioFiles.length > 0 ? 'border-violet-500/50 bg-violet-500/10' : 'border-white/20 hover:border-violet-500/50 hover:bg-white/5'}`}>
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept="audio/*"
                                    className="hidden"
                                    multiple={operation === 'merge'}
                                />
                                <div className="text-center">
                                    {audioFiles.length > 0 ? (
                                        <div className="text-violet-400">
                                            <p className="font-bold">{audioFiles.length} File(s)</p>
                                            <div className="mt-2 text-xs text-left max-h-24 overflow-y-auto space-y-1">
                                                {audioFiles.map((f, i) => <div key={i}>{f.name}</div>)}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Upload Audio</p>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">2. Choose Tool</h3>
                            <select
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                                className="glass-input w-full p-3"
                            >
                                <option value="trim" className="text-black">Trim Audio</option>
                                <option value="merge" className="text-black">Merge Files</option>
                                <option value="volume" className="text-black">Volume Boost</option>
                                <option value="fade" className="text-black">Fade In/Out</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column: Settings */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">3. Settings</h3>

                            {(operation === 'trim' || operation === 'all') && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Start Time (sec)</label>
                                        <input type="number" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="glass-input w-full p-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">End Time (sec)</label>
                                        <input type="number" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="glass-input w-full p-2 mt-1" />
                                    </div>
                                </div>
                            )}

                            {(operation === 'volume' || operation === 'all') && (
                                <div className="mt-4">
                                    <label className="text-sm text-gray-400">Volume: {volume}%</label>
                                    <input type="range" value={volume} min="0" max="200" onChange={(e) => setVolume(e.target.value)} className="w-full accent-violet-500 mt-2" />
                                </div>
                            )}

                            {(operation === 'fade' || operation === 'all') && (
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Fade In (sec)</label>
                                        <input type="number" value={fadeInDuration} onChange={(e) => setFadeInDuration(e.target.value)} className="glass-input w-full p-2 mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Fade Out (sec)</label>
                                        <input type="number" value={fadeOutDuration} onChange={(e) => setFadeOutDuration(e.target.value)} className="glass-input w-full p-2 mt-1" />
                                    </div>
                                </div>
                            )}

                            {operation === 'merge' && (
                                <p className="text-sm text-gray-400 italic">Files will be merged in the order they are listed.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status & Progress */}
                <div className="my-8">
                    {isLoading && (
                        <div className="w-full bg-white/10 rounded-full h-4 mb-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                    <p className="text-center text-gray-300">{message}</p>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={processAudio}
                        disabled={!loaded || audioFiles.length === 0 || isLoading}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!loaded || audioFiles.length === 0 || isLoading
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5'
                            }`}
                    >
                        {isLoading ? 'Processing...' : 'Process Audio'}
                    </button>

                    {outputUrl && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center animate-fade-in">
                            <p className="text-green-400 mb-4 font-semibold">Success! Your audio is ready.</p>
                            <audio controls src={outputUrl} className="w-full mb-4 opacity-80" />
                            <a
                                href={outputUrl}
                                download="edited_audio.mp3"
                                className="inline-block py-2 px-6 rounded-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg transition-all"
                            >
                                Download MP3
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
