import type { Metadata } from "next";
<<<<<<< HEAD
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
=======
import "./globals.css";

export const metadata: Metadata = {
  title: "MPLADS Dashboard",
  description: "MPLADS project monitoring dashboard",
>>>>>>> d76566189a93b3ae4bc75ce560f94dc7d7919eb3
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
<<<<<<< HEAD
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased font-sans`}>
        {children}
      </body>
=======
    <html lang="en">
      <body>{children}</body>
>>>>>>> d76566189a93b3ae4bc75ce560f94dc7d7919eb3
    </html>
  );
}
