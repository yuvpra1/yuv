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
    const [message, setMessage] = useState('Load ffmpeg-core to start');

    // Settings
    const [outputFormat, setOutputFormat] = useState('webp');
    const [quality, setQuality] = useState(85);
    const [resolution, setResolution] = useState('original');

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
            setMessage('FFmpeg loaded. Ready to convert images.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to load FFmpeg. Check console for details.');
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
        setMessage(`Selected: ${files.length} image(s)`);
    };

    const getScaleFilter = () => {
        if (resolution === 'original') return null;
        return `scale=${resolution}:-1`;
    };

    const getOutputExtension = () => {
        const extensions = {
            'jpg': 'jpg',
            'png': 'png',
            'webp': 'webp',
            'avif': 'avif'
        };
        return extensions[outputFormat];
    };

    const convertImages = async () => {
        if (inputImages.length === 0) return;
        setIsLoading(true);
        setMessage('Converting images...');
        const ffmpeg = ffmpegRef.current;
        const converted = [];

        try {
            for (let i = 0; i < inputImages.length; i++) {
                const img = inputImages[i];
                setMessage(`Processing ${i + 1}/${inputImages.length}: ${img.name}`);

                // Write input file
                await ffmpeg.writeFile('input.png', await fetchFile(img.file));

                const args = ['-i', 'input.png'];
                const scaleFilter = getScaleFilter();

                if (scaleFilter) {
                    args.push('-vf', scaleFilter);
                }

                // Format-specific encoding
                if (outputFormat === 'jpg') {
                    args.push('-q:v', Math.round((100 - quality) / 3.125).toString()); // Convert 0-100 to 0-31 (lower is better)
                } else if (outputFormat === 'webp') {
                    args.push('-quality', quality.toString());
                } else if (outputFormat === 'avif') {
                    args.push('-c:v', 'libaom-av1');
                    args.push('-crf', Math.round((100 - quality) / 2).toString()); // Convert to CRF scale
                } else if (outputFormat === 'png') {
                    args.push('-compression_level', '9');
                }

                const outputName = `output.${getOutputExtension()}`;
                args.push(outputName);

                await ffmpeg.exec(args);
                const data = await ffmpeg.readFile(outputName);

                const blob = new Blob([data.buffer], {
                    type: `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`
                });
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
            setMessage('Conversion Complete!');
        } catch (error) {
            console.error(error);
            setMessage('Conversion Failed! Check console for details.');
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const downloadImage = (img) => {
        const a = document.createElement('a');
        a.href = img.url;
        const nameWithoutExt = img.originalName.replace(/\.[^/.]+$/, '');
        a.download = `${nameWithoutExt}.${img.format}`;
        a.click();
    };

    const downloadAll = () => {
        processedImages.forEach((img, index) => {
            setTimeout(() => downloadImage(img), index * 200);
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    useEffect(() => {
        loadFFmpeg();
    }, []);

    return (
        <div className="converter-container glass-panel">
            <h1 className="title">Image Converter & Compressor</h1>

            <div className="status-bar">
                <p>{message}</p>
            </div>

            <div className="upload-section">
                <label className="file-input-label">
                    <span>{inputImages.length > 0 ? 'Change Images' : 'Select Images'}</span>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="file-input"
                        multiple
                    />
                </label>
                {inputImages.length > 0 && (
                    <span className="file-name">{inputImages.length} image(s) selected</span>
                )}
            </div>

            <div className="settings-section">
                <div className="setting-group">
                    <label className="setting-label">Output Format:</label>
                    <div className="format-selector">
                        <button
                            className={`format-btn ${outputFormat === 'jpg' ? 'active' : ''}`}
                            onClick={() => setOutputFormat('jpg')}
                        >
                            JPG
                        </button>
                        <button
                            className={`format-btn ${outputFormat === 'png' ? 'active' : ''}`}
                            onClick={() => setOutputFormat('png')}
                        >
                            PNG
                        </button>
                        <button
                            className={`format-btn ${outputFormat === 'webp' ? 'active' : ''}`}
                            onClick={() => setOutputFormat('webp')}
                        >
                            WebP
                        </button>
                        <button
                            className={`format-btn ${outputFormat === 'avif' ? 'active' : ''}`}
                            onClick={() => setOutputFormat('avif')}
                        >
                            AVIF
                        </button>
                    </div>
                </div>

                {outputFormat !== 'png' && (
                    <div className="setting-group">
                        <label className="setting-label">Quality: {quality}%</label>
                        <input
                            type="range"
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                            className="quality-slider"
                            min="1"
                            max="100"
                            step="1"
                        />
                        <span className="slider-hint">Higher quality = larger file size</span>
                    </div>
                )}

                <div className="setting-group">
                    <label className="setting-label">Resolution:</label>
                    <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="setting-select"
                    >
                        <option value="original">Original</option>
                        <option value="1920">1920px</option>
                        <option value="1280">1280px</option>
                        <option value="720">720px</option>
                        <option value="480">480px</option>
                    </select>
                </div>
            </div>

            {progress > 0 && progress < 100 && (
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    <span className="progress-text">{progress}%</span>
                </div>
            )}

            {inputImages.length > 0 && processedImages.length === 0 && (
                <div className="image-preview-grid">
                    {inputImages.map((img) => (
                        <div key={img.id} className="image-card">
                            <img src={img.preview} alt={img.name} className="preview-image" />
                            <p className="image-name">{img.name}</p>
                        </div>
                    ))}
                </div>
            )}

            {processedImages.length > 0 && (
                <div className="image-preview-grid">
                    {processedImages.map((img) => (
                        <div key={img.id} className="image-card">
                            <img src={img.url} alt={img.originalName} className="preview-image" />
                            <p className="image-name">{img.originalName}</p>
                            <p className="image-size">{formatFileSize(img.size)}</p>
                            <button onClick={() => downloadImage(img)} className="btn-download">
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="actions">
                {loaded && inputImages.length > 0 && processedImages.length === 0 && (
                    <button onClick={convertImages} disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Converting...' : 'Convert Images'}
                    </button>
                )}

                {processedImages.length > 0 && (
                    <button onClick={downloadAll} className="btn-success">
                        Download All ({processedImages.length})
                    </button>
                )}
            </div>
        </div>
    );
}
