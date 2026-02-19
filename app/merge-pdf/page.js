import MergePdf from '../components/MergePdf';

export const metadata = {
    title: 'Merge PDF - Combine PDF Files Online Free',
    description: 'Merge multiple PDF files into one document for free. No file upload required - process happens locally in your browser. Secure and fast PDF combiner.',
    alternates: {
        canonical: '/merge-pdf',
    },
};

export default function MergePdfPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Merge PDF Files
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Combine multiple PDFs into a single file instantly.
                </p>
            </div>
            <MergePdf />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>How to Merge PDFs?</h2>
                <ol>
                    <li>Upload your PDF files.</li>
                    <li>Reorder them using the arrows if needed.</li>
                    <li>Click "Merge PDFs" to download the combined document.</li>
                </ol>
                <p>
                    <strong>Privacy Note:</strong> Your files are processed locally. We do not store or view your documents.
                </p>
            </div>
        </div>
    );
}
