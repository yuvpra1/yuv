export const metadata = {
    title: 'About Us - CNVMP3',
    description: 'About CNVMP3 - Free Online Media Tools.',
};

export default function About() {
    return (
        <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-blue prose-lg mx-auto dark:prose-invert">
                <h1>About Us</h1>
                <p>
                    Welcome to CNVMP3.APP, your number one source for all things media conversion. We're dedicated to giving you the very best of online tools, with a focus on privacy, speed, and ease of use.
                </p>

                <h2>Our Mission</h2>
                <p>
                    Our mission is to provide free, high-quality media tools that run directly in your browser. We believe that you shouldn't have to download heavy software or upload your private files to a server just to perform simple tasks like converting a video or compressing a file.
                </p>

                <h2>Technology</h2>
                <p>
                    We utilize cutting-edge WebAssembly (WASM) technology, specifically FFmpeg WASM, to bring powerful desktop-grade media processing to your web browser. This means:
                </p>
                <ul>
                    <li><strong>Privacy:</strong> Files never leave your device.</li>
                    <li><strong>Security:</strong> No risk of server-side data leaks.</li>
                    <li><strong>Speed:</strong> Instant processing without network latency.</li>
                </ul>

                <p>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please just contact us.
                </p>
            </div>
        </div>
    );
}
