"use client";
import "./globals.css";
import "./layout.css";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>CIAI</title>
        <link rel="icon" href="/images/logo-icon.svg" type="image/x-icon" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300&amp;family=Google+Sans+Text_old:ital,wght@0,400;0,500;1,400;1,500&amp;display=block"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}