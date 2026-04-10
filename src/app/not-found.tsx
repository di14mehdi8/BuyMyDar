import Link from "next/link";
import { Inter } from "next/font/google";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RateTicker } from "@/components/layout/RateTicker";
import { NotFoundRedirect } from "@/components/NotFoundRedirect";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default async function NotFound() {
  const dict = await getDictionary("fr");

  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        <RateTicker lang="fr" dict={dict.ticker} />
        <Navbar lang="fr" dict={dict.nav} />
        <main id="main-content">
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
              <p className="text-8xl font-bold text-brand-100 mb-4">404</p>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Page introuvable
              </h1>
              <p className="text-slate-500 mb-6">
                La page que vous recherchez n&apos;existe pas ou a été déplacée.
              </p>
              <NotFoundRedirect href="/fr" />
              <div className="mt-6">
                <Link href="/fr" className="btn-primary">
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer lang="fr" dict={dict.footer} />
      </body>
    </html>
  );
}
