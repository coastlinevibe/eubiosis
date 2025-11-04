import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import CartSidebar from '@/components/CartSidebar'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider, useCart } from '@/context/CartContext'
import { defaultMetadata, organizationSchema } from '@/lib/seo'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4AAE9B" />
        <meta name="msapplication-TileColor" content="#4AAE9B" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="canonical" href="https://eubiosis.vercel.app" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <CartProvider>
          <ClientLayout>
            {children}
            <BottomNav />
          </ClientLayout>
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
