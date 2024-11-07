"use client";
import "./globals.css";
import "./layout.css";

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
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300&amp;family=Google+Sans+Text_old:ital,wght@0,400;0,500;1,400;1,500&amp;display=block"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
