import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MPLADS Monitoring System | Ministry of Statistics & Programme Implementation",
  description: "Official MPLADS project monitoring and risk analytics dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
