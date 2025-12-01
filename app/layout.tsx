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
  title: 'Happy Foraging - Wild Food Recipes & Foraging Guides',
  description: 'Discover the joy of foraging with expert guides, delicious wild food recipes, and sustainable harvesting practices. Learn to identify, harvest, and cook wild edibles safely.',
  keywords: ['foraging', 'wild food', 'edible plants', 'recipes', 'nature', 'sustainable'],
  authors: [{ name: 'Happy Foraging' }],
  openGraph: {
    title: 'Happy Foraging - Wild Food Recipes & Foraging Guides',
    description: 'Discover the joy of foraging with expert guides, delicious wild food recipes, and sustainable harvesting practices.',
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
