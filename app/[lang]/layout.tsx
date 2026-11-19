import type { Metadata } from "next";
import { Inter, Syne, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/providers/smooth-scroll-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import Navbar from "@/components/layout/navbar";
import { isValidLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getDictionary, getContents, getSharedData } from "@/lib/loaders";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohammed Faiz Alam — Full-Stack Engineer, Founder & Quantitative Markets",
  description:
    "Portfolio of Mohammed Faiz Alam. Full-stack software engineering (Next.js, TypeScript, Python FastAPI), AgencyGrow paid acquisition, and quantitative market structure.",
  openGraph: {
    title: "Mohammed Faiz Alam — Full-Stack Engineer & Founder",
    description:
      "Resilient web systems, quantitative simulators, and high-intent paid acquisition built from first principles.",
    type: "website",
    locale: "en_US",
    siteName: "Mohammed Faiz Alam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Faiz Alam — Full-Stack Engineer & Founder",
    description:
      "Resilient web systems, quantitative simulators, and high-intent paid acquisition.",
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const [dictionary, contents, shared] = await Promise.all([
    getDictionary(lang),
    getContents(lang),
    getSharedData(),
  ]);

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <LanguageProvider lang={lang} dictionary={dictionary} contents={contents} shared={shared}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
          >
            <CustomCursor />
            <SmoothScroll>
              <Navbar />
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
