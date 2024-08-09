'use client';

import { SessionProvider } from 'next-auth/react';
import { Providers } from "./providers/provider";
import "./globals.css";
import TopAppBar from "./components/TopBar";
import { XContextProvider } from "@/context/context";
import FirebaseConnectionManager from "./components/FirebaseConnectionManager";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <XContextProvider>
            <TopAppBar />
            <FirebaseConnectionManager />
            <Providers>{children}</Providers>
          </XContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
