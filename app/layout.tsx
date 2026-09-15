import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dose",
  description: "Subscriber-first Dose customer experience prototype"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
