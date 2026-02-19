import GifMaker from '../components/GifMaker';

export const metadata = {
    title: 'Free GIF Maker - Create GIFs from Video or Images',
    description: 'Create animated GIFs from video files or combine multiple images. Fast, free, and no watermark GIF creator.',
    alternates: {
        canonical: '/gif-maker',
    },
};

export default function GifMakerPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    GIF Maker
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Turn your videos and images into fun animated GIFs.
                </p>
            </div>
            <GifMaker />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Make GIFs Online</h2>
                <p>
                    Create engaging GIFs for social media, memes, or reaction images. You can convert short video clips to GIF or stitch together a sequence of images.
                </p>
                <h2>How it works</h2>
                <ul>
                    <li><strong>Video to GIF:</strong> Upload a video, select the segment, and convert.</li>
                    <li><strong>Images to GIF:</strong> Upload multiple images, set the delay, and create an animation.</li>
                </ul>
            </div>
        </div>
    );
}
