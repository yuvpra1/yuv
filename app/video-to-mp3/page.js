import Converter from '../components/Converter';

export const metadata = {
    title: 'Free Video to MP3 Converter - Convert MP4 to MP3 Online',
    description: 'Extract audio from video files instantly. Convert MP4, AVI, MOV to MP3 format for free. No file upload required, processes directly in your browser.',
    alternates: {
        canonical: '/video-to-mp3',
    },
};

export default function VideoToMp3Page() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Video to MP3 Converter
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Extract high-quality audio from your video files in seconds.
                </p>
            </div>
            <Converter />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>How to convert Video to MP3?</h2>
                <ol>
                    <li>Select your video file (MP4, AVI, MOV, etc.) from your device.</li>
                    <li>Click the "Convert" button to start extraction.</li>
                    <li>Wait for the process to finish directly in your browser.</li>
                    <li>Download your MP3 file instantly.</li>
                </ol>
                <p>
                    Our tool uses advanced WASM technology to process files locally on your device, ensuring faster conversion and maximum privacy.
                </p>
            </div>
        </div>
    );
}
