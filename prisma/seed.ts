import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.location.deleteMany()

  // Seed Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    { name: 'Books', slug: 'books' },
    { name: 'Automotive', slug: 'automotive' },
    { name: 'Health & Beauty', slug: 'health-beauty' },
    { name: 'Toys & Games', slug: 'toys-games' },
  ]

  console.log('📂 Seeding categories...')
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
  }

  // Seed Locations
  const locations = [
    { name: 'New York', slug: 'new-york' },
    { name: 'Los Angeles', slug: 'los-angeles' },
    { name: 'Chicago', slug: 'chicago' },
    { name: 'Houston', slug: 'houston' },
    { name: 'Phoenix', slug: 'phoenix' },
    { name: 'Philadelphia', slug: 'philadelphia' },
    { name: 'San Antonio', slug: 'san-antonio' },
    { name: 'San Diego', slug: 'san-diego' },
    { name: 'Dallas', slug: 'dallas' },
    { name: 'San Jose', slug: 'san-jose' },
  ]

  console.log('📍 Seeding locations...')
  for (const location of locations) {
    await prisma.location.create({
      data: location,
    })
  }

  // Seed Products
  const products = [
    // Electronics
    {
      title: 'iPhone 15 Pro Max',
      description: 'Latest Apple iPhone with advanced camera system and A17 Pro chip. Excellent condition, barely used.',
      price: 1199.99,
      category: 'Electronics',
      location: 'New York',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
      ]),
      slug: 'iphone-15-pro-max-nyc',
    },
    {
      title: 'MacBook Air M2',
      description: 'Powerful and lightweight laptop perfect for work and creativity. 13-inch display, 256GB storage.',
      price: 999.00,
      category: 'Electronics',
      location: 'Los Angeles',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
      ]),
      slug: 'macbook-air-m2-la',
    },
    {
      title: 'Samsung 4K Smart TV 55"',
      description: 'Crystal clear 4K resolution with smart TV features. Perfect for streaming and gaming.',
      price: 649.99,
      category: 'Electronics',
      location: 'Chicago',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'
      ]),
      slug: 'samsung-4k-tv-chicago',
    },
    
    // Clothing
    {
      title: 'Vintage Leather Jacket',
      description: 'Authentic vintage leather jacket in excellent condition. Size Medium, perfect for fall and winter.',
      price: 189.99,
      category: 'Clothing',
      location: 'New York',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
      ]),
      slug: 'vintage-leather-jacket-nyc',
    },
    {
      title: 'Designer Sneakers',
      description: 'Limited edition designer sneakers, size 10. Worn only a few times, like new condition.',
      price: 299.99,
      category: 'Clothing',
      location: 'Los Angeles',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
      ]),
      slug: 'designer-sneakers-la',
    },

    // Home & Garden
    {
      title: 'Modern Coffee Table',
      description: 'Sleek modern coffee table with glass top and wooden legs. Perfect for contemporary living rooms.',
      price: 299.00,
      category: 'Home & Garden',
      location: 'Houston',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
      ]),
      slug: 'modern-coffee-table-houston',
    },
    {
      title: 'Garden Tool Set',
      description: 'Complete garden tool set with shovel, rake, pruners, and more. Perfect for gardening enthusiasts.',
      price: 89.99,
      category: 'Home & Garden',
      location: 'Phoenix',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
      ]),
      slug: 'garden-tool-set-phoenix',
    },

    // Sports & Outdoors
    {
      title: 'Mountain Bike',
      description: 'High-quality mountain bike with 21-speed transmission. Great for trails and city riding.',
      price: 599.99,
      category: 'Sports & Outdoors',
      location: 'San Diego',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544191696-15693072b5a5?w=500'
      ]),
      slug: 'mountain-bike-san-diego',
    },
    {
      title: 'Camping Tent 4-Person',
      description: 'Spacious 4-person camping tent with easy setup. Waterproof and durable for all weather conditions.',
      price: 149.99,
      category: 'Sports & Outdoors',
      location: 'Dallas',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500'
      ]),
      slug: 'camping-tent-4-person-dallas',
    },

    // Books
    {
      title: 'Programming Books Collection',
      description: 'Collection of 15 programming books covering JavaScript, Python, and web development. Great condition.',
      price: 199.99,
      category: 'Books',
      location: 'San Jose',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
      ]),
      slug: 'programming-books-collection-san-jose',
    },

    // Automotive
    {
      title: 'Car Dash Camera',
      description: 'High-definition dash camera with night vision and GPS tracking. Easy installation.',
      price: 129.99,
      category: 'Automotive',
      location: 'Philadelphia',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500'
      ]),
      slug: 'car-dash-camera-philadelphia',
    },

    // Health & Beauty
    {
      title: 'Professional Hair Dryer',
      description: 'Salon-quality hair dryer with multiple heat settings and ionic technology.',
      price: 79.99,
      category: 'Health & Beauty',
      location: 'Chicago',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'
      ]),
      slug: 'professional-hair-dryer-chicago',
    },

    // Toys & Games
    {
      title: 'Board Game Collection',
      description: 'Collection of popular board games including Monopoly, Scrabble, and Risk. Perfect for family game nights.',
      price: 89.99,
      category: 'Toys & Games',
      location: 'San Antonio',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500'
      ]),
      slug: 'board-game-collection-san-antonio',
    },

    // Additional products for better search testing
    {
      title: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      price: 249.99,
      category: 'Electronics',
      location: 'New York',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
      ]),
      slug: 'wireless-headphones-nyc',
    },
    {
      title: 'Yoga Mat Set',
      description: 'Complete yoga mat set with blocks, strap, and carrying bag. Non-slip surface.',
      price: 49.99,
      category: 'Sports & Outdoors',
      location: 'Los Angeles',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'
      ]),
      slug: 'yoga-mat-set-la',
    },
    {
      title: 'Vintage Watch',
      description: 'Classic vintage watch with leather strap. Mechanical movement, recently serviced.',
      price: 399.99,
      category: 'Clothing',
      location: 'Chicago',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'
      ]),
      slug: 'vintage-watch-chicago',
    },
  ]

  console.log('🛍️ Seeding products...')
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created:`)
  console.log(`   - ${categories.length} categories`)
  console.log(`   - ${locations.length} locations`)
  console.log(`   - ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })