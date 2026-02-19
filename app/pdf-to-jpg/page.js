import PdfToJpg from '../components/PdfToJpg';

export const metadata = {
    title: 'PDF to JPG Converter - Convert PDF Pages to Images',
    description: 'Convert PDF pages to high-quality JPG images for free. Extract images from PDF documents instantly. 100% private and client-side processing.',
    alternates: {
        canonical: '/pdf-to-jpg',
    },
};

export default function PdfToJpgPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    PDF to JPG Converter
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Turn PDF pages into image files quickly.
                </p>
            </div>
            <PdfToJpg />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Convert PDF Pages to Images</h2>
                <p>
                    Need to turn a PDF document into a series of images? Our tool converts every page of your PDF into a high-quality JPG file that you can download individually.
                </p>
            </div>
        </div>
    );
}
