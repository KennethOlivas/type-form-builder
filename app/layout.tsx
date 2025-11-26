import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TypeForm Clone - Build Beautiful Forms",
    template: "%s | TypeForm Clone",
  },
  description: "Create beautiful, conversational forms, surveys, quizzes, and more. The best Typeform alternative.",
  keywords: ["form builder", "survey maker", "quiz maker", "typeform clone", "nextjs", "react"],
  authors: [{ name: "TypeForm Clone Team" }],
  creator: "TypeForm Clone Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "TypeForm Clone - Build Beautiful Forms",
    description: "Create beautiful, conversational forms, surveys, quizzes, and more.",
    siteName: "TypeForm Clone",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeForm Clone - Build Beautiful Forms",
    description: "Create beautiful, conversational forms, surveys, quizzes, and more.",
    creator: "@typeformclone",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
