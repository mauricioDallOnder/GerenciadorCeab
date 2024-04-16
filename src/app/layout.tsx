'use client'
import { Providers } from "./providers/provider";
import "./globals.css";
import TopAppBar from "./components/TopBar";
import Footer from "./components/Footer";
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
          <Footer/>
      </body>
    </html>
  );
}


// 
//