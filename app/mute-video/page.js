import MuteVideo from '../components/MuteVideo';

export const metadata = {
    title: 'Mute Video Online - Remove Audio from Video Free',
    description: 'Easily mute a video online for free. Remove the audio track from your MP4, MOV, or AVI video directly in your browser without uploading files.',
    alternates: {
        canonical: '/mute-video',
    },
};

export default function MuteVideoPage() {
    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <MuteVideo />

            {/* SEO Content */}
            <div className="max-w-3xl mx-auto mt-16 prose prose-invert">
                <h2 className="text-2xl font-bold text-white text-center mb-8">How to Mute a Video Online</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <div className="text-red-500 text-xl font-bold mb-2">1. Upload Video</div>
                        <p className="text-gray-400 text-sm">Select any MP4, MOV, or AVI video from your device. No size limits.</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <div className="text-red-500 text-xl font-bold mb-2">2. Remove Audio</div>
                        <p className="text-gray-400 text-sm">Click the Mute Video button. We'll strip the audio track instantly.</p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <div className="text-red-500 text-xl font-bold mb-2">3. Download</div>
                        <p className="text-gray-400 text-sm">Save your new silent video directly to your computer or phone.</p>
                    </div>
                </div>

                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4">Why use our Video Muter?</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span><strong>100% Private:</strong> Your videos are processed entirely in your web browser. We never upload or store your files on our servers.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span><strong>Zero Quality Loss:</strong> We strip the audio track without re-encoding the video stream, meaning your video retains its exact original quality.</span>
                        </li>
                        <li className="flex items-start">
                            <svg className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span><strong>Lightning Fast:</strong> Because we don't re-encode the video or upload it, muting a video takes just seconds.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
