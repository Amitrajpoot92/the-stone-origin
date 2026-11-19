import { Playfair_Display, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import NavigationWrapper from "@/components/shared/NavigationWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cursive",
});

export const metadata = {
  title: "The Stone Origin | Premium Divine Idols & Statues",
  description: "Discover premium handcrafted stone, marble, and brass idols. Bring divine energy and aesthetic beauty to your home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${greatVibes.variable}`}>
      <body className="antialiased min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans pb-16 md:pb-0 relative">
        <AuthProvider>
          <CartProvider>
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
