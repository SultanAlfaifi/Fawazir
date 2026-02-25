import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google"; // Using Cairo for modern Arabic typography
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SultanaChatButton } from "@/components/SultanaChatButton";
import { ToastProvider } from "@/components/ui/Toaster";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "700", "900"],
  display: 'swap', // Improve LCP by showing fallback font first
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f59e0b',
  viewportFit: 'cover', // Handle notch on mobile
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.fawazir.com";

export const metadata: Metadata = {
  title: {
    default: "فوازير | فوازير ذكية بالذكاء الاصطناعي",
    template: "%s | فوازير",
  },
  description: "منصة فوازير الذكية الأولى لعام 2026 - تحديات يومية، جوائز قيمة، وتجربة فريدة مدعومة بالذكاء الاصطناعي مع سلطانة.",
  keywords: ["فوازير", "فوازير 2026", "مسابقات", "ذكاء اصطناعي", "سلطانة", "تحديات", "ربح جوائز", "رمضان 2026", "رمضان"],
  authors: [{ name: "فوازير" }],
  creator: "فوازير",
  publisher: "فوازير",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "فوازير | تحدي العقول بأسلوب جديد",
    description: "انضم إلى منصة فوازير الذكية واستمتع بتحديات يومية مدعومة بالذكاء الاصطناعي. حل الفوازير، اجمع النقاط، وتصدر القائمة!",
    url: baseUrl,
    siteName: "فوازير",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fawazir - فوازير",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "فوازير | تحدي العقول بأسلوب جديد",
    description: "منصة فوازير الذكية الأولى - تحديات يومية وجوائز قيمة مدعومة بالذكاء الاصطناعي.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} antialiased min-h-dynamic`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
            <SultanaChatButton />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
