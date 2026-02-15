// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers"; // Import the new provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Anurupa | AI Personality & Aesthetic Engine",
  description: "Find your aesthetic match.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap all children with the Providers component */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}