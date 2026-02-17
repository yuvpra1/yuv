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
    const [message, setMessage] = useState('Load ffmpeg-core to start');
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
            setMessage('FFmpeg loaded. Ready to compress.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
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
        <div className="converter-container glass-panel">
            <h1 className="title">Video Compressor</h1>

            <div className="status-bar">
                <p>{message}</p>
            </div>

            <div className="upload-section">
                <label className="file-input-label">
                    <span>{videoFile ? 'Change Video' : 'Select Video'}</span>
                    <input type="file" onChange={handleFileUpload} accept="video/*" className="file-input" />
                </label>
                {videoFile && <span className="file-name">{videoFile.name}</span>}
            </div>

            <div className="settings-section">
                <div className="setting-group">
                    <label className="setting-label">Quality:</label>
                    <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="setting-select"
                    >
                        <option value="high">High (CRF 23)</option>
                        <option value="medium">Medium (CRF 28)</option>
                        <option value="low">Low (CRF 35)</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label className="setting-label">Resolution:</label>
                    <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="setting-select"
                    >
                        <option value="original">Original</option>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                    </select>
                </div>
            </div>

            {progress > 0 && progress < 100 && (
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                </div>
            )}

            <div className="actions">
                {loaded && videoFile && !compressedUrl && (
                    <button onClick={compressVideo} disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Compressing...' : 'Compress Video'}
                    </button>
                )}

                {compressedUrl && (
                    <a href={compressedUrl} download="compressed.mp4" className="btn-success">
                        Download Compressed Video
                    </a>
                )}
            </div>
        </div>
    );
}
