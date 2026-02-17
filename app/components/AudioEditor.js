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
    const [message, setMessage] = useState('Load ffmpeg-core to start');
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
            setMessage('FFmpeg loaded. Ready to edit audio.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Check console for details.');
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
            setMessage('Processing Failed! Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    return (
        <div className="converter-container glass-panel">
            <h1 className="title">Audio Editor</h1>

            <div className="status-bar">
                <p>{message}</p>
            </div>

            <div className="upload-section">
                <label className="file-input-label">
                    <span>{audioFiles.length > 0 ? 'Change Audio' : 'Select Audio'}</span>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="audio/*"
                        className="file-input"
                        multiple={operation === 'merge'}
                    />
                </label>
                {audioFiles.length > 0 && (
                    <div className="merge-file-list">
                        {audioFiles.map((file, index) => (
                            <span key={index} className="file-name">{file.name}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="settings-section">
                <div className="setting-group">
                    <label className="setting-label">Operation:</label>
                    <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        className="setting-select"
                    >
                        <option value="trim">Trim Audio</option>
                        <option value="merge">Merge Audio Files</option>
                        <option value="volume">Adjust Volume</option>
                        <option value="fade">Fade Effects</option>
                        <option value="all">All Effects</option>
                    </select>
                </div>

                {(operation === 'trim' || operation === 'all') && (
                    <div className="audio-controls">
                        <div className="setting-group">
                            <label className="setting-label">Start Time (seconds):</label>
                            <input
                                type="number"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="time-input"
                                min="0"
                                step="0.1"
                            />
                        </div>
                        <div className="setting-group">
                            <label className="setting-label">End Time (seconds):</label>
                            <input
                                type="number"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="time-input"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>
                )}

                {(operation === 'volume' || operation === 'all') && (
                    <div className="setting-group">
                        <label className="setting-label">Volume: {volume}%</label>
                        <input
                            type="range"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="volume-slider"
                            min="0"
                            max="200"
                            step="5"
                        />
                    </div>
                )}

                {(operation === 'fade' || operation === 'all') && (
                    <div className="fade-controls">
                        <div className="setting-group">
                            <label className="setting-label">Fade In Duration (seconds):</label>
                            <input
                                type="number"
                                value={fadeInDuration}
                                onChange={(e) => setFadeInDuration(e.target.value)}
                                className="time-input"
                                min="0"
                                step="0.1"
                            />
                        </div>
                        <div className="setting-group">
                            <label className="setting-label">Fade Out Duration (seconds):</label>
                            <input
                                type="number"
                                value={fadeOutDuration}
                                onChange={(e) => setFadeOutDuration(e.target.value)}
                                className="time-input"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </div>
                )}
            </div>

            {progress > 0 && progress < 100 && (
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                </div>
            )}

            {outputUrl && (
                <div className="audio-preview">
                    <label className="setting-label">Preview:</label>
                    <audio controls src={outputUrl} className="audio-player" />
                </div>
            )}

            <div className="actions">
                {loaded && audioFiles.length > 0 && !outputUrl && (
                    <button onClick={processAudio} disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Processing...' : 'Process Audio'}
                    </button>
                )}

                {outputUrl && (
                    <a href={outputUrl} download="edited-audio.mp3" className="btn-success">
                        Download Audio
                    </a>
                )}
            </div>
        </div>
    );
}
