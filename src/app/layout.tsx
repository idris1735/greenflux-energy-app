"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "./components/navbar";
import { CartProvider } from "../lib/CartContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMarketplace = pathname === "/";

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {!isMarketplace && <Navbar />}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
