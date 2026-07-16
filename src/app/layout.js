import { Plus_Jakarta_Sans, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/utils/Navigation/Header";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from '@/components/utils/Context/AuthContext';
import { DashboardProvider } from "@/components/utils/Context/DashboardContext";
import { Footer } from "@/components/utils/Footer/Footer";
import { CartProvider } from "@/components/utils/Context/CartContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-accent"
});

export const metadata = {
  title: "GoRevive — Certified IT Asset Lifecycle Management",
  description: "India's #1 Certified IT Refurbisher. Secure data destruction, certified refurbishment, and maximum value recovery.",
  icons: {
    icon: "/favicon.ico", 
    apple: "/favicon.ico", 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>

      <body suppressHydrationWarning className={`${jakarta.variable} ${dmSans.variable} ${playfair.variable} font-body  text-primary overflow-x-hidden antialiased`}>
        <DashboardProvider>
          <AuthProvider>
            <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-left" />
            </CartProvider>
          </AuthProvider>
        </DashboardProvider>
      </body>

    </html>
  );
}