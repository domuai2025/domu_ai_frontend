"use client"; // ✅ Must be at the top

import localFont from "next/font/local";
import { Suspense } from "react";

import { SupabaseClientProvider } from "@/components/SupabaseClientProvider";
import ReactQueryProvider from "@/components/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SupabaseProvider } from '@/components/supabase/provider';
// import { Sidebar } from '@/components/dashboard/Sidebar';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SupabaseProvider>
          <SupabaseClientProvider>
            <ReactQueryProvider>
              <Toaster />
              <Suspense fallback={<div>Loading...</div>}>
                <div className="flex min-h-screen">
                  {/* <Sidebar /> */}
                  <main className="flex-1 overflow-auto">
                    {children}
                  </main>
                </div>
              </Suspense>
            </ReactQueryProvider>
          </SupabaseClientProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
