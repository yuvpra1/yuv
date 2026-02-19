import Link from 'next/link';


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
    name: 'Video to MP3',
    description: 'Extract audio from any video files instantly. Supports MP4, AVI, MOV.',
    href: '/video-to-mp3',
    icon: VideoIcon,
    color: 'bg-blue-50 text-blue-700',
  },
  {
    name: 'Video Compressor',
    description: 'Reduce video file size while maintaining quality. Fast and efficient.',
    href: '/video-compressor',
    icon: CompressorIcon,
    color: 'bg-orange-50 text-orange-700',
  },
  {
    name: 'Audio Editor',
    description: 'Trim, cut and edit audio files directly in your browser.',
    href: '/audio-editor',
    icon: AudioIcon,
    color: 'bg-violet-50 text-violet-700',
  },
  {
    name: 'GIF Maker',
    description: 'Create animated GIFs from videos or images sequences.',
    href: '/gif-maker',
    icon: GifIcon,
    color: 'bg-pink-50 text-pink-700',
  },
  {
    name: 'Image Converter',
    description: 'Convert between PNG, JPG, WEBP formats securely.',
    href: '/image-converter',
    icon: PhotoIcon,
    color: 'bg-green-50 text-green-700',
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
            <span className="block text-blue-600">Media Tools Suite</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Convert, compress, and edit your media files directly in your browser.
            No file uploads, 100% private, and completely free.
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
                <h3 className="text-lg font-medium">
                  <Link href={tool.href} className="focus:outline-none dark:text-white">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {tool.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
              <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                <ArrowRight />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Choose CNVMP3?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3>🔒 100% Privacy</h3>
              <p>
                Unlike other online converters, we process your files directly on your device using WebAssembly technology. Your files never leave your computer or phone.
              </p>
            </div>
            <div>
              <h3>🚀 Blazing Fast</h3>
              <p>
                No need to wait for uploads or downloads. Processing happens locally, meaning it's as fast as your device allows.
              </p>
            </div>
            <div>
              <h3>📱 Mobile Friendly</h3>
              <p>
                Our tools work perfectly on smartphones and tablets. Convert videos or edit audio on the go without installing any apps.
              </p>
            </div>
            <div>
              <h3>💸 Completely Free</h3>
              <p>
                No hidden fees, no credit card required. Use all our premium media tools without paying a dime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
