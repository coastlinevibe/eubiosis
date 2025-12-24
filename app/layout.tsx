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
        <meta name="description" content="Eubiosis-S - Premium honey-based probiotic with 42 bacterial strains for optimal gut health. Nature in a bottle." />
        <meta name="keywords" content="Eubiosis, Eubiosis-S, probiotic, gut health, honey supplement, natural wellness" />
        <meta property="og:image" content="/images/Website Product Image.png" />
        <meta property="og:image:secure_url" content="/images/Website Product Image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.eubiosis.pro" />
        
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
