'use client';

import { useState } from 'react';
import Converter from './components/Converter';
import VideoCompressor from './components/VideoCompressor';
import AudioEditor from './components/AudioEditor';
import GifMaker from './components/GifMaker';
import ImageConverter from './components/ImageConverter';

export default function Home() {
  const [activeTab, setActiveTab] = useState('converter');

  return (
    <main>
      <div className="tab-container">
        <button
          className={`tab ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          Video to MP3
        </button>
        <button
          className={`tab ${activeTab === 'compressor' ? 'active' : ''}`}
          onClick={() => setActiveTab('compressor')}
        >
          Video Compressor
        </button>
        <button
          className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio')}
        >
          Audio Editor
        </button>
        <button
          className={`tab ${activeTab === 'gif' ? 'active' : ''}`}
          onClick={() => setActiveTab('gif')}
        >
          GIF Maker
        </button>
        <button
          className={`tab ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          Image Converter
        </button>
      </div>

      {activeTab === 'converter' && <Converter />}
      {activeTab === 'compressor' && <VideoCompressor />}
      {activeTab === 'audio' && <AudioEditor />}
      {activeTab === 'gif' && <GifMaker />}
      {activeTab === 'image' && <ImageConverter />}
    </main>
  );
}
