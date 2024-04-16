'use client'
import { Providers } from "./providers/provider";
import "./globals.css";
import TopAppBar from "./components/TopBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <TopAppBar/>
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}


// 
//