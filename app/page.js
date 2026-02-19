import Link from 'next/link';

export const metadata = {
  alternates: {
    canonical: '/',
  },
};


// Simple SVGs to avoid dependency issues if heroicons not installed
const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const VideoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-violet-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const GifIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-pink-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CompressorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-orange-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
  </svg>
);

const tools = [
  {
    name: 'Video to MP3 Converter',
    description: 'Extract high-quality MP3 audio from any video file (MP4, AVI, MOV).',
    href: '/video-to-mp3',
    icon: VideoIcon,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    name: 'Video Compressor',
    description: 'Reduce video file size by up to 80% without losing quality.',
    href: '/video-compressor',
    icon: CompressorIcon,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    name: 'Audio Cutter & Editor',
    description: 'Trim, cut, and edit your audio files professionally.',
    href: '/audio-editor',
    icon: AudioIcon,
    color: 'bg-violet-50 text-violet-700',
  },
  {
    name: 'GIF Maker from Video',
    description: 'Create animated GIFs from your favorite video clips.',
    href: '/gif-maker',
    icon: GifIcon,
    color: 'bg-pink-50 text-pink-700',
  },
  {
    name: 'Image Converter (JPG/PNG)',
    description: 'Convert images between JPG, PNG, and WEBP formats instantly.',
    href: '/image-converter',
    icon: PhotoIcon,
    color: 'bg-green-50 text-green-700',
  },
  {
    name: 'Merge PDF Files',
    description: 'Combine multiple PDF documents into a single file easily.',
    href: '/merge-pdf',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    color: 'bg-red-50 text-red-700',
  },
  {
    name: 'PDF to JPG Converter',
    description: 'Turn every page of your PDF into high-quality JPG images.',
    href: '/pdf-to-jpg',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    name: 'Image Resizer (Pixel Perfect)',
    description: 'Resize any photo to exact width and height dimensions.',
    href: '/image-resizer',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    name: 'Meme Generator',
    description: 'Make viral memes instantly by adding text to images.',
    href: '/meme-generator',
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-pink-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    color: 'bg-pink-50 text-pink-700',
  },
];

export default function Home() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Free Online</span>
            <span className="block text-blue-600">All-in-One Media Tools</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Edit videos, convert PDFs, and resize images directly in your browser.
            <br />
            <span className="font-semibold text-blue-500">Fast. Private. No Uploads.</span>
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="relative group bg-white dark:bg-gray-900 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-800"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ring-4 ring-white dark:ring-gray-900 ${tool.color.replace('text-', 'bg-').replace('50', '100')}`}>
                  <tool.icon />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  <Link href={tool.href} className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {tool.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
              <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-blue-500 transition-colors" aria-hidden="true">
                <ArrowRight />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Use CNVMP3 Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0">🔒 100% Secure & Private</h3>
              <p>
                We value your privacy. Unlike other sites, we process your files directly on your device using advanced WebAssembly technology. Your personal photos and documents never leave your computer.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0">🚀 Lightning Fast Speed</h3>
              <p>
                Experience zero wait times. Since there are no uploads or downloads to a slow server, your conversions happen instantly, powered by your own device's speed.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0">📱 Works on All Devices</h3>
              <p>
                Whether you are using an iPhone, Android, Tablet, or PC, our tools are fully responsive and work perfectly without installing any heavy apps.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0">💸 Always Free to Use</h3>
              <p>
                Access premium-quality media tools completely free. No watermarks, no hidden costs, and no credit card required. Just open and start creating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
