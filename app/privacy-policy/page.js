export const metadata = {
    title: 'Privacy Policy - CNVMP3',
    description: 'Privacy Policy for CNVMP3. Learn how we handle your data.',
};

export default function PrivacyPolicy() {
    return (
        <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-blue prose-lg mx-auto dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>Introduction</h2>
                <p>
                    At CNVMP3, accessible from https://cnvmp3.app, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CNVMP3 and how we use it.
                </p>

                <h2>Data Processing (Locally)</h2>
                <p>
                    **Important:** CNVMP3 operates primarily as a client-side application. When you use our video converters, audio editors, or image tools, the processing happens **locally on your device** using WebAssembly technology. Your media files are **NOT** uploaded to our servers. This ensures maximum privacy as your files never leave your device.
                </p>

                <h2>Log Files</h2>
                <p>
                    CNVMP3 follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
                </p>

                <h2>Cookies and Web Beacons</h2>
                <p>
                    Like any other website, CNVMP3 uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>

                <h2>Google DoubleClick DART Cookie</h2>
                <p>
                    Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>
                </p>
            </div>
        </div>
    );
}
