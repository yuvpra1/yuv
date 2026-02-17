'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export default function Converter() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [mp3Url, setMp3Url] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Load ffmpeg-core to start');
  const ffmpegRef = useRef(null);
  const messageRef = useRef(null);

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
      setMessage('FFmpeg loaded. Ready to convert.');
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
    setMp3Url(null);
    setProgress(0);
    setMessage(`Selected: ${file.name}`);
  };

  const transcode = async () => {
    if (!videoFile) return;
    setIsLoading(true);
    setMessage('Converting...');
    const ffmpeg = ffmpegRef.current;

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec(['-i', 'input.mp4', 'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');

      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'audio/mp3' })
      );
      setMp3Url(url);
      setMessage('Conversion Complete!');
    } catch (error) {
      console.error(error);
      setMessage('Conversion Failed!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilter();
  }, []);

  return (
    <div className="converter-container glass-panel">
      <h1 className="title">Video to MP3 Converter</h1>

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

      {progress > 0 && progress < 100 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}

      <div className="actions">
        {loaded && videoFile && !mp3Url && (
          <button onClick={transcode} disabled={isLoading} className="btn-primary">
            {isLoading ? 'Converting...' : 'Convert to MP3'}
          </button>
        )}

        {mp3Url && (
          <a href={mp3Url} download="converted.mp3" className="btn-success">
            Download MP3
          </a>
        )}
      </div>
    </div>
  );
}
