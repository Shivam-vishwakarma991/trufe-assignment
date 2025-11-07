import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types'
import ProductDetail from '@/components/product/ProductDetail'
import { ErrorBoundary, ProductDetailSkeleton } from '@/components/ui'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

// Use dynamic rendering instead of SSG for fresh product data
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  const images = JSON?.parse(product?.images) as string[]
  const firstImage = images[0]

  return {
    title: `${product.title} - ${product.category} | Marketplace`,
    description: product.description.slice(0, 160),
    keywords: [product.title, product.category, product.location, 'marketplace', 'buy', 'sell'].join(', '),
    openGraph: {
      title: product.title,
      description: product.description,
      type: 'website',
      images: firstImage ? [{ url: firstImage, alt: product.title }] : [],
      siteName: 'Marketplace',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: firstImage ? [firstImage] : [],
    },
    alternates: {
      canonical: `/catalog/${product.id}`,
    },
  }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return null
    }

    return {
      ...product,
      images: product.images, // Keep as string for now, will parse in component
    } as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  // Generate structured data for SEO
  const images = JSON?.parse(product?.images) as string[]
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Marketplace',
      },
    },
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Marketplace',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ErrorBoundary>
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail product={product} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}