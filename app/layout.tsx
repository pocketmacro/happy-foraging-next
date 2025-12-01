import type { Metadata } from 'next'
import { Roboto_Condensed } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Happy Foraging - Local Recipes & Farmers Market Guides',
  description: 'Discover the joy of cooking with fresh, local ingredients from farmers markets and local suppliers. Explore seasonal recipes, cooking tips, and find local producers near you.',
  keywords: ['local food', 'farmers market', 'seasonal recipes', 'local ingredients', 'sustainable eating', 'local suppliers'],
  authors: [{ name: 'Happy Foraging' }],
  openGraph: {
    title: 'Happy Foraging - Local Recipes & Farmers Market Guides',
    description: 'Discover the joy of cooking with fresh, local ingredients from farmers markets and local suppliers. Explore seasonal recipes and find local producers.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
