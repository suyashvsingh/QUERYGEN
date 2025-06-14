import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const fira_code = Fira_Code({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUERYGEN",
  description: "A simple text to SQL generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fira_code.className} antialiased`}>{children}</body>
    </html>
  );
}
