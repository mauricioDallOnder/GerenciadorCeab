'use client'
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
        <XContextProvider>
        <TopAppBar />
          <FirebaseConnectionManager />
          <Providers>{children}</Providers>
        </XContextProvider>
      </body>
    </html>
  );
}
