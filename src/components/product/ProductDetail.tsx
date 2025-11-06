'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const images = JSON?.parse(product?.images) as string[]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link 
            href="/catalog" 
            className="hover:text-gray-900 transition-colors"
          >
            Catalog
          </Link>
          <span>/</span>
          <Link 
            href={`/catalog?category=${encodeURIComponent(product.category)}`}
            className="hover:text-gray-900 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Gallery */}
            <div className="space-y-4">
              <ProductGallery images={images} title={product.title} />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>

        {/* Back to Catalog */}
        <div className="mt-8">
          <Link
            href="/catalog"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Catalog
          </Link>
        </div>
      </div>
    </div>
  )
}