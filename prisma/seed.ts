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
  ]

  console.log('📍 Seeding locations...')
  for (const location of locations) {
    await prisma.location.create({
      data: location,
    })
  }

  // Seed Products - At least 2 products per category
  const products = [
    // Electronics - New York
    {
      title: 'iPhone 15 Pro Max',
      description: 'Latest Apple iPhone with advanced camera system and A17 Pro chip. Excellent condition, barely used.',
      price: 1199.99,
      category: 'Electronics',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500']),
      slug: 'iphone-15-pro-max-nyc',
    },
    {
      title: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
      price: 249.99,
      category: 'Electronics',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']),
      slug: 'wireless-headphones-nyc',
    },

    // Electronics - Los Angeles
    {
      title: 'MacBook Air M2',
      description: 'Powerful and lightweight laptop perfect for work and creativity. 13-inch display, 256GB storage.',
      price: 999.00,
      category: 'Electronics',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500']),
      slug: 'macbook-air-m2-la',
    },
    {
      title: 'iPad Pro 12.9"',
      description: 'Latest iPad Pro with M2 chip, perfect for creative professionals. Includes Apple Pencil.',
      price: 899.99,
      category: 'Electronics',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500']),
      slug: 'ipad-pro-la',
    },

    // Electronics - Chicago
    {
      title: 'Samsung 4K Smart TV 55"',
      description: 'Crystal clear 4K resolution with smart TV features. Perfect for streaming and gaming.',
      price: 649.99,
      category: 'Electronics',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500']),
      slug: 'samsung-4k-tv-chicago',
    },
    {
      title: 'Gaming Console PS5',
      description: 'PlayStation 5 with extra controller and 3 games. Like new condition.',
      price: 499.99,
      category: 'Electronics',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500']),
      slug: 'ps5-chicago',
    },

    // Clothing - New York
    {
      title: 'Vintage Leather Jacket',
      description: 'Authentic vintage leather jacket in excellent condition. Size Medium, perfect for fall and winter.',
      price: 189.99,
      category: 'Clothing',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500']),
      slug: 'vintage-leather-jacket-nyc',
    },
    {
      title: 'Designer Handbag',
      description: 'Authentic designer handbag in pristine condition. Comes with original packaging.',
      price: 599.99,
      category: 'Clothing',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500']),
      slug: 'designer-handbag-nyc',
    },

    // Clothing - Los Angeles
    {
      title: 'Designer Sneakers',
      description: 'Limited edition designer sneakers, size 10. Worn only a few times, like new condition.',
      price: 299.99,
      category: 'Clothing',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500']),
      slug: 'designer-sneakers-la',
    },
    {
      title: 'Summer Dress Collection',
      description: 'Set of 5 beautiful summer dresses, sizes S-M. Perfect for warm weather.',
      price: 149.99,
      category: 'Clothing',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500']),
      slug: 'summer-dress-collection-la',
    },

    // Clothing - Chicago
    {
      title: 'Vintage Watch',
      description: 'Classic vintage watch with leather strap. Mechanical movement, recently serviced.',
      price: 399.99,
      category: 'Clothing',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500']),
      slug: 'vintage-watch-chicago',
    },
    {
      title: 'Winter Coat',
      description: 'Warm winter coat with down insulation. Size Large, perfect for cold weather.',
      price: 179.99,
      category: 'Clothing',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500']),
      slug: 'winter-coat-chicago',
    },

    // Home & Garden - Houston
    {
      title: 'Modern Coffee Table',
      description: 'Sleek modern coffee table with glass top and wooden legs. Perfect for contemporary living rooms.',
      price: 299.00,
      category: 'Home & Garden',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500']),
      slug: 'modern-coffee-table-houston',
    },
    {
      title: 'Dining Table Set',
      description: 'Beautiful dining table with 6 chairs. Solid wood construction, seats 6-8 people.',
      price: 799.99,
      category: 'Home & Garden',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500']),
      slug: 'dining-table-set-houston',
    },

    // Home & Garden - Phoenix
    {
      title: 'Garden Tool Set',
      description: 'Complete garden tool set with shovel, rake, pruners, and more. Perfect for gardening enthusiasts.',
      price: 89.99,
      category: 'Home & Garden',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500']),
      slug: 'garden-tool-set-phoenix',
    },
    {
      title: 'Outdoor Patio Furniture',
      description: '4-piece patio furniture set with cushions. Weather-resistant and comfortable.',
      price: 599.99,
      category: 'Home & Garden',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500']),
      slug: 'patio-furniture-phoenix',
    },

    // Sports & Outdoors - New York
    {
      title: 'Road Bike',
      description: 'Lightweight road bike perfect for city commuting and weekend rides. 18-speed.',
      price: 449.99,
      category: 'Sports & Outdoors',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500']),
      slug: 'road-bike-nyc',
    },
    {
      title: 'Tennis Racket Set',
      description: 'Professional tennis racket set with 2 rackets and carrying case.',
      price: 129.99,
      category: 'Sports & Outdoors',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500']),
      slug: 'tennis-racket-set-nyc',
    },

    // Sports & Outdoors - Los Angeles
    {
      title: 'Yoga Mat Set',
      description: 'Complete yoga mat set with blocks, strap, and carrying bag. Non-slip surface.',
      price: 49.99,
      category: 'Sports & Outdoors',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500']),
      slug: 'yoga-mat-set-la',
    },
    {
      title: 'Surfboard',
      description: 'Professional surfboard in excellent condition. Perfect for intermediate to advanced surfers.',
      price: 399.99,
      category: 'Sports & Outdoors',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1502933691298-84fc14542831?w=500']),
      slug: 'surfboard-la',
    },

    // Sports & Outdoors - Chicago
    {
      title: 'Mountain Bike',
      description: 'High-quality mountain bike with 21-speed transmission. Great for trails and city riding.',
      price: 599.99,
      category: 'Sports & Outdoors',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544191696-15693072b5a5?w=500']),
      slug: 'mountain-bike-chicago',
    },
    {
      title: 'Camping Tent 4-Person',
      description: 'Spacious 4-person camping tent with easy setup. Waterproof and durable for all weather conditions.',
      price: 149.99,
      category: 'Sports & Outdoors',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500']),
      slug: 'camping-tent-chicago',
    },

    // Books - New York
    {
      title: 'Programming Books Collection',
      description: 'Collection of 15 programming books covering JavaScript, Python, and web development. Great condition.',
      price: 199.99,
      category: 'Books',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500']),
      slug: 'programming-books-nyc',
    },
    {
      title: 'Classic Literature Set',
      description: 'Beautiful hardcover set of classic literature including Shakespeare, Dickens, and Austen.',
      price: 149.99,
      category: 'Books',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500']),
      slug: 'classic-literature-set-nyc',
    },

    // Books - Los Angeles
    {
      title: 'Cookbook Collection',
      description: 'Set of 10 popular cookbooks covering various cuisines. Perfect for food enthusiasts.',
      price: 89.99,
      category: 'Books',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1589998059171-988d887df646?w=500']),
      slug: 'cookbook-collection-la',
    },
    {
      title: 'Business Books Bundle',
      description: 'Collection of bestselling business and self-help books. Great for entrepreneurs.',
      price: 129.99,
      category: 'Books',
      location: 'Los Angeles',
      images: JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500']),
      slug: 'business-books-la',
    },

    // Automotive - Houston
    {
      title: 'Car Dash Camera',
      description: 'High-definition dash camera with night vision and GPS tracking. Easy installation.',
      price: 129.99,
      category: 'Automotive',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500']),
      slug: 'car-dash-camera-houston',
    },
    {
      title: 'Car Vacuum Cleaner',
      description: 'Powerful portable car vacuum cleaner with multiple attachments. Cordless design.',
      price: 59.99,
      category: 'Automotive',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500']),
      slug: 'car-vacuum-houston',
    },

    // Automotive - Phoenix
    {
      title: 'Car Phone Mount',
      description: 'Universal car phone mount with strong magnetic hold. Compatible with all smartphones.',
      price: 24.99,
      category: 'Automotive',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500']),
      slug: 'car-phone-mount-phoenix',
    },
    {
      title: 'Tire Pressure Gauge',
      description: 'Digital tire pressure gauge with LED display. Accurate and easy to use.',
      price: 19.99,
      category: 'Automotive',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500']),
      slug: 'tire-pressure-gauge-phoenix',
    },

    // Health & Beauty - Chicago
    {
      title: 'Professional Hair Dryer',
      description: 'Salon-quality hair dryer with multiple heat settings and ionic technology.',
      price: 79.99,
      category: 'Health & Beauty',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500']),
      slug: 'professional-hair-dryer-chicago',
    },
    {
      title: 'Skincare Set',
      description: 'Complete skincare routine set with cleanser, toner, serum, and moisturizer.',
      price: 99.99,
      category: 'Health & Beauty',
      location: 'Chicago',
      images: JSON.stringify(['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500']),
      slug: 'skincare-set-chicago',
    },

    // Health & Beauty - New York
    {
      title: 'Makeup Brush Set',
      description: 'Professional makeup brush set with 12 brushes and carrying case.',
      price: 49.99,
      category: 'Health & Beauty',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500']),
      slug: 'makeup-brush-set-nyc',
    },
    {
      title: 'Electric Toothbrush',
      description: 'Rechargeable electric toothbrush with 5 cleaning modes and travel case.',
      price: 89.99,
      category: 'Health & Beauty',
      location: 'New York',
      images: JSON.stringify(['https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500']),
      slug: 'electric-toothbrush-nyc',
    },

    // Toys & Games - Houston
    {
      title: 'Board Game Collection',
      description: 'Collection of popular board games including Monopoly, Scrabble, and Risk. Perfect for family game nights.',
      price: 89.99,
      category: 'Toys & Games',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500']),
      slug: 'board-game-collection-houston',
    },
    {
      title: 'LEGO Architecture Set',
      description: 'LEGO Architecture set featuring famous landmarks. Complete with all pieces.',
      price: 129.99,
      category: 'Toys & Games',
      location: 'Houston',
      images: JSON.stringify(['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500']),
      slug: 'lego-architecture-houston',
    },

    // Toys & Games - Phoenix
    {
      title: 'Remote Control Car',
      description: 'High-speed remote control car with rechargeable battery. Great for kids and adults.',
      price: 79.99,
      category: 'Toys & Games',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500']),
      slug: 'rc-car-phoenix',
    },
    {
      title: 'Puzzle Collection',
      description: 'Set of 5 challenging puzzles ranging from 500 to 2000 pieces.',
      price: 59.99,
      category: 'Toys & Games',
      location: 'Phoenix',
      images: JSON.stringify(['https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=500']),
      slug: 'puzzle-collection-phoenix',
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
