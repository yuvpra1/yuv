import VideoCompressor from '../components/VideoCompressor';

export const metadata = {
    title: 'Free Video Compressor - Reduce Video Size Online',
    description: 'Compress MP4, MOV, AVI videos online for free. Reduce file size without losing quality. Best for WhatsApp, Email, and Social Media sharing.',
    alternates: {
        canonical: '/video-compressor',
    },
};

export default function VideoCompressorPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Video Compressor
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Reduce video file size efficiently without quality loss.
                </p>
            </div>
            <VideoCompressor />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Why compress videos?</h2>
                <p>
                    Large video files are hard to share via email or messaging apps. Our video compressor reduces the file size significantly while maintaining good visual quality, making it easier to share on WhatsApp, Telegram, or upload to social media.
                </p>
                <h2>Features</h2>
                <ul>
                    <li>Fast compression using FFmpeg WASM.</li>
                    <li>No server upload - 100% private.</li>
                    <li>Supports MP4, MOV, AVI and more.</li>
                </ul>
            </div>
        </div>
    );
}
