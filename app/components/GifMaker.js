'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function GifMaker() {
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState('video'); // 'video' or 'images'
    const [inputFiles, setInputFiles] = useState([]);
    const [gifUrl, setGifUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Load ffmpeg-core to start');

    // Settings
    const [fps, setFps] = useState(15);
    const [resolution, setResolution] = useState('480');
    const [optimize, setOptimize] = useState(true);
    const [startTime, setStartTime] = useState('0');
    const [endTime, setEndTime] = useState('5');

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
            setMessage('FFmpeg loaded. Ready to create GIFs.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setInputFiles(files);
        setGifUrl(null);
        setProgress(0);
        if (mode === 'video') {
            setMessage(`Selected: ${files[0]?.name}`);
        } else {
            setMessage(`Selected: ${files.length} image(s)`);
        }
    };

    const getScaleFilter = () => {
        if (resolution === 'original') return null;
        return `scale=${resolution}:-1:flags=lanczos`;
    };

    const createGif = async () => {
        if (inputFiles.length === 0) return;
        setIsLoading(true);
        setMessage('Creating GIF...');
        const ffmpeg = ffmpegRef.current;

        try {
            if (mode === 'video') {
                // Video to GIF
                const videoFile = inputFiles[0];
                await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

                if (optimize) {
                    // Two-pass with palette for better quality
                    const scaleFilter = getScaleFilter();
                    const baseFilter = `fps=${fps}${scaleFilter ? ',' + scaleFilter : ''}`;

                    // Generate palette
                    const paletteArgs = [
                        '-ss', startTime,
                        '-to', endTime,
                        '-i', 'input.mp4',
                        '-vf', `${baseFilter},palettegen`,
                        'palette.png'
                    ];
                    await ffmpeg.exec(paletteArgs);

                    // Create GIF with palette
                    const gifArgs = [
                        '-ss', startTime,
                        '-to', endTime,
                        '-i', 'input.mp4',
                        '-i', 'palette.png',
                        '-lavfi', `${baseFilter}[x];[x][1:v]paletteuse`,
                        'output.gif'
                    ];
                    await ffmpeg.exec(gifArgs);
                } else {
                    // Simple conversion
                    const scaleFilter = getScaleFilter();
                    const filter = `fps=${fps}${scaleFilter ? ',' + scaleFilter : ''}`;

                    const args = [
                        '-ss', startTime,
                        '-to', endTime,
                        '-i', 'input.mp4',
                        '-vf', filter,
                        'output.gif'
                    ];
                    await ffmpeg.exec(args);
                }
            } else {
                // Images to GIF
                for (let i = 0; i < inputFiles.length; i++) {
                    await ffmpeg.writeFile(`img${i}.png`, await fetchFile(inputFiles[i]));
                }

                // Create concat file
                const concatContent = inputFiles.map((_, i) => `file 'img${i}.png'\nduration ${1 / fps}`).join('\n');
                await ffmpeg.writeFile('concat.txt', concatContent);

                const scaleFilter = getScaleFilter();
                const filter = scaleFilter || 'null';

                if (optimize) {
                    // Generate palette
                    await ffmpeg.exec([
                        '-f', 'concat',
                        '-safe', '0',
                        '-i', 'concat.txt',
                        '-vf', `${filter},palettegen`,
                        'palette.png'
                    ]);

                    // Create GIF with palette
                    await ffmpeg.exec([
                        '-f', 'concat',
                        '-safe', '0',
                        '-i', 'concat.txt',
                        '-i', 'palette.png',
                        '-lavfi', `${filter}[x];[x][1:v]paletteuse`,
                        'output.gif'
                    ]);
                } else {
                    await ffmpeg.exec([
                        '-f', 'concat',
                        '-safe', '0',
                        '-i', 'concat.txt',
                        '-vf', filter,
                        'output.gif'
                    ]);
                }
            }

            const data = await ffmpeg.readFile('output.gif');
            const url = URL.createObjectURL(
                new Blob([data.buffer], { type: 'image/gif' })
            );
            setGifUrl(url);
            setMessage('GIF Created Successfully!');
        } catch (error) {
            console.error(error);
            setMessage('GIF Creation Failed! Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    return (
        <div className="converter-container glass-panel">
            <h1 className="title">GIF Maker</h1>

            <div className="status-bar">
                <p>{message}</p>
            </div>

            <div className="settings-section">
                <div className="setting-group">
                    <label className="setting-label">Mode:</label>
                    <div className="mode-selector">
                        <button
                            className={`mode-btn ${mode === 'video' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('video');
                                setInputFiles([]);
                                setGifUrl(null);
                            }}
                        >
                            Video to GIF
                        </button>
                        <button
                            className={`mode-btn ${mode === 'images' ? 'active' : ''}`}
                            onClick={() => {
                                setMode('images');
                                setInputFiles([]);
                                setGifUrl(null);
                            }}
                        >
                            Images to GIF
                        </button>
                    </div>
                </div>
            </div>

            <div className="upload-section">
                <label className="file-input-label">
                    <span>
                        {inputFiles.length > 0
                            ? (mode === 'video' ? 'Change Video' : 'Change Images')
                            : (mode === 'video' ? 'Select Video' : 'Select Images')
                        }
                    </span>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept={mode === 'video' ? 'video/*' : 'image/*'}
                        className="file-input"
                        multiple={mode === 'images'}
                    />
                </label>
                {inputFiles.length > 0 && (
                    <div className="file-list">
                        {mode === 'video' ? (
                            <span className="file-name">{inputFiles[0].name}</span>
                        ) : (
                            <div className="image-grid">
                                {inputFiles.map((file, index) => (
                                    <span key={index} className="file-name">{file.name}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="settings-section">
                {mode === 'video' && (
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

                <div className="setting-group">
                    <label className="setting-label">FPS: {fps}</label>
                    <input
                        type="range"
                        value={fps}
                        onChange={(e) => setFps(e.target.value)}
                        className="fps-slider"
                        min="5"
                        max="30"
                        step="1"
                    />
                    <span className="slider-hint">Higher FPS = smoother but larger file</span>
                </div>

                <div className="setting-group">
                    <label className="setting-label">Resolution:</label>
                    <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="setting-select"
                    >
                        <option value="original">Original</option>
                        <option value="720">720p</option>
                        <option value="480">480p</option>
                        <option value="360">360p</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="optimization-toggle">
                        <input
                            type="checkbox"
                            checked={optimize}
                            onChange={(e) => setOptimize(e.target.checked)}
                        />
                        <span>Optimize GIF (better quality, takes longer)</span>
                    </label>
                </div>
            </div>

            {progress > 0 && progress < 100 && (
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                </div>
            )}

            {gifUrl && (
                <div className="gif-preview">
                    <label className="setting-label">Preview:</label>
                    <img src={gifUrl} alt="Generated GIF" className="gif-image" />
                </div>
            )}

            <div className="actions">
                {loaded && inputFiles.length > 0 && !gifUrl && (
                    <button onClick={createGif} disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Creating GIF...' : 'Create GIF'}
                    </button>
                )}

                {gifUrl && (
                    <a href={gifUrl} download="animated.gif" className="btn-success">
                        Download GIF
                    </a>
                )}
            </div>
        </div>
    );
}
