import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { NotFoundContent } from "@/components/sections/not-found-content";
import enDict from "@/dictionaries/en.json";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "404 — Page Not Found | Mohammed Faiz Alam",
  description: "The requested page could not be found.",
};

export default function RootNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <CustomCursor />
          <NotFoundContent dict={enDict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
