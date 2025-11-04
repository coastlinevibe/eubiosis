import { Metadata } from 'next'

export const siteConfig = {
  name: "Eubiosis",
  title: "Eubiosis — Nature in a Bottle | Premium Honey-Based Probiotic",
  description: "Discover Eubiosis, the revolutionary honey-based probiotic with 42 bacterial strains. Nature's perfect balance for optimal gut health and wellness. Made in South Africa.",
  url: "https://eubiosis.vercel.app",
  ogImage: "/images/Website Thumbnail.png",
  keywords: [
    "Eubiosis",
    "nature in a bottle",
    "honey-based probiotic",
    "gut health",
    "42 bacterial strains",
    "natural wellness",
    "South African probiotic",
    "organic honey supplement",
    "digestive health",
    "microbiome support",
    "natural health supplement",
    "probiotic supplement",
    "honey probiotic",
    "gut microbiome",
    "digestive wellness"
  ]
}

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Eubiosis",
      url: siteConfig.url,
    }
  ],
  creator: "Eubiosis",
  publisher: "Eubiosis",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Eubiosis - Nature in a Bottle",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@eubiosis",
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
  verification: {
    google: "your-google-verification-code", // You'll need to add this from Google Search Console
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export const shopMetadata: Metadata = {
  title: "Shop Eubiosis | Premium Honey-Based Probiotic Supplement",
  description: "Purchase Eubiosis, the revolutionary honey-based probiotic with 42 bacterial strains. Available in 50ml and 100ml bottles. Same-day delivery in Mokopane, Limpopo. Free shipping across South Africa on qualifying orders.",
  keywords: [
    ...siteConfig.keywords,
    "buy eubiosis",
    "purchase probiotic",
    "honey supplement online",
    "order eubiosis",
    "probiotic shop",
    "natural health store"
  ],
  openGraph: {
    title: "Shop Eubiosis | Premium Honey-Based Probiotic",
    description: "Purchase Eubiosis, the revolutionary honey-based probiotic with 42 bacterial strains. Same-day delivery in Mokopane, Limpopo. Free shipping across South Africa on qualifying orders.",
    url: `${siteConfig.url}/shop`,
    images: [
      {
        url: "/images/Website Product Image.png",
        width: 800,
        height: 600,
        alt: "Eubiosis Product - Nature in a Bottle",
      }
    ],
  },
}

// Structured Data for SEO
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Eubiosis",
  "description": "Premium honey-based probiotic supplements for optimal gut health",
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/images/logo.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "areaServed": "ZA",
    "availableLanguage": "English"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "ZA"
  },
  "sameAs": [
    // Add your social media URLs here
    // "https://www.facebook.com/eubiosis",
    // "https://www.instagram.com/eubiosis",
    // "https://twitter.com/eubiosis"
  ]
}

export const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Eubiosis - Nature in a Bottle",
  "description": "Premium honey-based probiotic with 42 bacterial strains for optimal gut health and wellness",
  "brand": {
    "@type": "Brand",
    "name": "Eubiosis"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Eubiosis"
  },
  "image": [
    `${siteConfig.url}/images/Website Product Image.png`,
    `${siteConfig.url}/images/bottles/bottle-combo.png`
  ],
  "offers": [
    {
      "@type": "Offer",
      "name": "50ml Bottle",
      "price": "499",
      "priceCurrency": "ZAR",
      "availability": "https://schema.org/InStock",
      "url": `${siteConfig.url}/shop`,
      "seller": {
        "@type": "Organization",
        "name": "Eubiosis"
      }
    },
    {
      "@type": "Offer",
      "name": "100ml Bottle", 
      "price": "799",
      "priceCurrency": "ZAR",
      "availability": "https://schema.org/InStock",
      "url": `${siteConfig.url}/shop`,
      "seller": {
        "@type": "Organization",
        "name": "Eubiosis"
      }
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Thandi M."
      },
      "reviewBody": "My digestion improved in days — I feel lighter and more energetic. Highly recommend!"
    }
  ]
}
