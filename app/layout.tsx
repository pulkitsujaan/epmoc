import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EPMOC — Event Planning & Management Organizing Council",
  description:
    "EPMOC is the official event management body of IIIT Una — planning, organizing, and executing unforgettable experiences. Together we manage.",
  keywords: ["EPMOC", "IIIT Una", "events", "cultural fest", "student club", "Mridang"],
  openGraph: {
    title: "EPMOC — Together We Manage",
    description: "Official event management council of IIIT Una",
    siteName: "EPMOC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a24",
              color: "#f0f0f8",
              border: "1px solid #2a2a38",
            },
            success: { iconTheme: { primary: "#A8FF3E", secondary: "#08080e" } },
            error: { iconTheme: { primary: "#FF6B2B", secondary: "#08080e" } },
          }}
        />
      </body>
    </html>
  );
}
