import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://cnvmp3.app'),
  title: {
    default: 'Free Online Media Tools - Video to MP3, Compressor, Audio Editor & More',
    template: '%s | Free Online Media Tools'
  },
  description: 'Convert videos to MP3, compress videos, edit audio, create GIFs and convert images online for free. No installation required. Fast, secure, and browser-based tools.',
  keywords: ['video to mp3', 'video compressor', 'audio editor', 'gif maker', 'image converter', 'online tools', 'free tools', 'ffmpeg wasm'],
  authors: [{ name: 'CNVMP3' }],
  creator: 'CNVMP3',
  publisher: 'CNVMP3',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Free Online Media Tools - Video to MP3, Compressor, Audio Editor & More',
    description: 'Convert videos to MP3, compress videos, edit audio, create GIFs and convert images online for free.',
    url: 'https://cnvmp3.app',
    siteName: 'Free Online Media Tools',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Media Tools - Video to MP3, Compressor, Audio Editor & More',
    description: 'Convert videos to MP3, compress videos, edit audio, create GIFs and convert images online for free.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-HGVWWMW7R2`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HGVWWMW7R2');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
