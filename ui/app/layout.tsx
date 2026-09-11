import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPLADS Dashboard",
  description: "MPLADS project monitoring dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
