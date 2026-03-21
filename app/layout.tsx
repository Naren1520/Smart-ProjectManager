import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter for clean Apple-like typography
import "./globals.css";
import { Providers } from "@/components/Providers";
import { InitialLoader } from "@/components/InitialLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeamForge AI - Smart Project Management",
  description: "AI-Powered Project Management & Collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300`}>
        <InitialLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
