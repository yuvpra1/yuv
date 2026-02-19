export const metadata = {
    title: 'Terms of Service - CNVMP3',
    description: 'Terms of Service for using CNVMP3 tools.',
};

export default function TermsOfService() {
    return (
        <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-blue prose-lg mx-auto dark:prose-invert">
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Terms</h2>
                <p>
                    By accessing this Website, accessible from https://cnvmp3.app, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
                </p>

                <h2>2. Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials on CNVMP3's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>

                <h2>3. Disclaimer</h2>
                <p>
                    All the materials on CNVMP3’s Website are provided "as is". CNVMP3 makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, CNVMP3 does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.
                </p>

                <h2>4. Limitations</h2>
                <p>
                    CNVMP3 or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on CNVMP3’s Website, even if CNVMP3 or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
                </p>
            </div>
        </div>
    );
}
