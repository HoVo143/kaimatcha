import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/footer";
import { CartProvider } from "../components/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "../lib/shopify";
import { Navbar } from "../components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kai Matcha",
  description: "Kai Matcha",
  icons: {
    icon: [
      { url: "/Logo_kaimatcha_White.png" }, // favicon chính
      { url: "/Logo_kaimatcha_White.png", type: "image/x-icon" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = getCart(cartId);
  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <html lang="en">
        <body className={inter.className}>
          <CartProvider cartPromise={cart}>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </body>
      </html>
    </>
  );
}
