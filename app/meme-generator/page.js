import MemeGenerator from '../components/MemeGenerator';

export const metadata = {
    title: 'Free Meme Generator - Create Memes Online',
    description: 'Create funny memes instantly by adding text to images. Fast, free, and simple meme maker. No watermark.',
    alternates: {
        canonical: '/meme-generator',
    },
};

export default function MemeGeneratorPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Meme Generator
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Make viral memes in seconds.
                </p>
            </div>
            <MemeGenerator />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Create Custom Memes</h2>
                <p>
                    Upload any image and add classic top/bottom text to create your own memes. Perfect for social media content!
                </p>
            </div>
        </div>
    );
}
