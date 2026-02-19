import ImageResizer from '../components/ImageResizer';

export const metadata = {
    title: 'Free Image Resizer - Resize Images Online',
    description: 'Resize images to specific dimensions (width/height) online. Maintain aspect ratio and adjust quality/compression. Fast and free photo resizer.',
    alternates: {
        canonical: '/image-resizer',
    },
};

export default function ImageResizerPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Image Resizer
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Resize photos to pixel-perfect dimensions.
                </p>
            </div>
            <ImageResizer />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Resize Images Easily</h2>
                <p>
                    Whether you need a specific size for a profile picture, banner, or website asset, our Image Resizer lets you adjust width and height with precision.
                </p>
            </div>
        </div>
    );
}
