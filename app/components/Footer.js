import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto dark:bg-gray-900 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link href="/about" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        About Us
                    </Link>
                    <Link href="/privacy-policy" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        Privacy Policy
                    </Link>
                    <Link href="/terms-of-service" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        Terms of Service
                    </Link>
                </div>
                <div className="mt-8 md:mt-0 md:order-1">
                    <p className="text-center text-base text-gray-400">
                        &copy; {currentYear} CNVMP3. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
