import ThemeProvider from "../../components/ThemeProvider";
import Navbar from "../../components/Navbar";
import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "UltraGPT",
  description: "UltraGPT, now in NextJS!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
