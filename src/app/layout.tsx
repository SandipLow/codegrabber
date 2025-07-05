import "@/app/global.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Head from "next/head";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <Head>
                {/* Favicons */}
                <link rel="icon" type="image/x-icon" href="/manifest/icon-256x256.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/manifest/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/manifest/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/manifest/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest/site.webmanifest" />
                <link rel="mask-icon" href="/manifest/safari-pinned-tab.svg" color="#5bbad5" />

                {/* Meta Tags */}
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="color-scheme" content="light" />
                <meta name="application-name" content="Code Grabber" />
                <meta name="generator" content="Code Grabber" />
                <meta name="referrer" content="origin-when-cross-origin" />
                <meta name="google-site-verification" content="BTcyYqfgbgf6Jn765uP8EzKXB4-2I4AD0_QcJgfXOHc" />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="English" />
                <meta name="revisit-after" content="7 days" />
                <meta name="creator" content="Sandip Low" />
                <meta name="publisher" content="CDEK c/o" />
                <meta name="format-detection" content="telephone=no, address=no, email=no" />
            </Head>
            <body className="bg-gray-50 dark:bg-gray-900 dark:text-white min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}

