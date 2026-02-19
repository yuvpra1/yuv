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
  const [message, setMessage] = useState('Loading FFmpeg core...');
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
      setMessage('Ready to convert! Select a video file.');
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
    setMp3Url(null);
    setProgress(0);
    setMessage(`Selected: ${file.name}`);
  };

  const transcode = async () => {
    if (!videoFile) return;
    setIsLoading(true);
    setMessage('Converting video to MP3...');
    const ffmpeg = ffmpegRef.current;

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-ab', '192k', 'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');

      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'audio/mp3' })
      );
      setMp3Url(url);
      setMessage('Conversion Complete! Download your MP3 below.');
    } catch (error) {
      console.error(error);
      setMessage('Conversion Failed! Please try another file.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilter();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-panel p-8 text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Video to MP3</h2>
          <p className="text-gray-300">Extract audio from your videos instantly.</p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <label className={`block w-full border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all ${videoFile ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 hover:border-blue-500/50 hover:bg-white/5'}`}>
            <input type="file" onChange={handleFileUpload} accept="video/*" className="hidden" />
            {videoFile ? (
              <div className="text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium truncate max-w-xs mx-auto">{videoFile.name}</p>
                <p className="text-sm opacity-75 mt-1">Click to change file</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-medium">Click to upload video</p>
                <p className="text-sm opacity-75 mt-1">MP4, MOV, AVI supported</p>
              </div>
            )}
          </label>
        </div>

        {/* Status & Progress */}
        <div className="mb-8 min-h-[60px]">
          {isLoading ? (
            <div className="w-full bg-white/10 rounded-full h-4 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          ) : null}
          <p className="text-sm text-gray-300 animate-pulse">{message}</p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={transcode}
            disabled={!loaded || !videoFile || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${!loaded || !videoFile || isLoading
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95'
              }`}
          >
            {isLoading ? 'Processing...' : 'Convert to MP3'}
          </button>

          {mp3Url && (
            <div className="space-y-4">
              <a
                href={mp3Url}
                download={`${videoFile?.name.split('.')[0] || 'audio'}.mp3`}
                className="block w-full py-4 rounded-xl font-bold text-lg bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 transition-all hover:-translate-y-0.5"
              >
                Download MP3
              </a>
              <button
                onClick={() => {
                  setVideoFile(null);
                  setMp3Url(null);
                  setProgress(0);
                  setMessage('Ready to convert! Select a video file.');
                }}
                className="block w-full py-4 rounded-xl font-bold text-lg bg-gray-700 hover:bg-gray-600 text-white shadow-lg transition-all hover:-translate-y-0.5"
              >
                Convert Another File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
