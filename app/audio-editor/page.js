import AudioEditor from '../components/AudioEditor';

export const metadata = {
    title: 'Free Audio Editor - Trim, Cut and Edit Audio Online',
    description: 'Edit audio files directly in your browser. Trim, cut, and adjust volume of MP3, WAV, and M4A files. Simple and fast audio editing tool.',
    alternates: {
        canonical: '/audio-editor',
    },
};

export default function AudioEditorPage() {
    return (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                    Audio Editor
                </h1>
                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                    Trim, cut, and edit your audio files with ease.
                </p>
            </div>
            <AudioEditor />

            <div className="mt-16 prose prose-blue prose-lg text-gray-500 mx-auto dark:prose-invert">
                <h2>Online Audio Cutter & Editor</h2>
                <p>
                    Need to make a ringtone or remove an unwanted part from a recording? Our Audio Editor allows you to visually trim and edit audio files without installing complex software.
                </p>
                <h2>Supported Formats</h2>
                <p>
                    Works with all common audio formats including MP3, WAV, AAC, and M4A.
                </p>
            </div>
        </div>
    );
}
