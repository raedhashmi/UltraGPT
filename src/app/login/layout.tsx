import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "UltraGPT - Login",
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
        <Theme accentColor="orange" grayColor="sand" radius="large">
          {children}
        </Theme>
      </body>
    </html>
  );
}