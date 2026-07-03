import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gulfgate Cafeteria - Authentic Middle Eastern Cuisine | Dhaid, Sharjah",
  description: "Experience the finest Middle Eastern cuisine at Gulfgate Cafeteria in Dhaid, Sharjah. Serving delicious shawarma, broasted chicken, burgers, fresh juices, and more.",
  keywords: ["restaurant", "Middle Eastern food", "shawarma", "Dhaid", "Sharjah", "UAE", "cafeteria", "halal food"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
