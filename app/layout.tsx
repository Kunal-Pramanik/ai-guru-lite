import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Guru – किताब का पन्ना दिखाओ, आसान भाषा में समझो",
  description: "Take a photo of a textbook page; AI Guru finds the topic and explains it with a short animated video and easy notes in Hindi, English, Gujarati, Bengali and Marathi.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#7c5cff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Baloo+Bhai+2:wght@500;600;700;800&family=Baloo+Da+2:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}