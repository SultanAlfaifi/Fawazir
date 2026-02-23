import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Using Cairo for modern Arabic typography
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SultanaChatButton } from "@/components/SultanaChatButton";
import { ToastProvider } from "@/components/ui/Toaster";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "فوازير 2026",
  description: "منصة التحديات والمعرفة الأولى",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.className} antialiased min-h-screen`}>
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
