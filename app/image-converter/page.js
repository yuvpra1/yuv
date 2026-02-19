import ImageConverter from '../components/ImageConverter';

export const metadata = {
    title: 'Free Image Converter - Convert PNG, JPG, WEBP Online',
    description: 'Convert images between PNG, JPG, WEBP, and other formats. Batch image conversion supported. High quality and fast processing.',
    alternates: {
        canonical: '/image-converter',
    },
};

export default function ImageConverterPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Image Converter
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Convert between different image formats instantly.
                </p>
            </div>
            <ImageConverter />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Convert Images Free</h2>
                <p>
                    Need a JPG instead of a PNG? Or want to convert modern WEBP images to standard formats? Our Image Converter handles it all.
                </p>
                <h2>Bulk Conversion</h2>
                <p>
                    You can select multiple images at once and convert them all in a single click. All processing happens on your device for maximum speed and privacy.
                </p>
            </div>
        </div>
    );
}
