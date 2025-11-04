import { Metadata } from 'next'
import { shopMetadata } from '@/lib/seo'

export const metadata: Metadata = shopMetadata

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
