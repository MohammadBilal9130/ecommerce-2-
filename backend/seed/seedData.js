import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import StoreSetting from '../models/StoreSetting.js';
import AdminActivity from '../models/AdminActivity.js';
import { connectDB, closeDB } from '../config/db.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Purging existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await StoreSetting.deleteMany();
    await AdminActivity.deleteMany();

    console.log('[Seed] Creating Dual-Admin Accounts (Shoeb Khan & Shan Khan)...');
    
    // Create Admin 1: Shoeb Khan
    const shoebAdmin = await User.create({
      name: 'Shoeb Khan',
      email: 'shoeb@gangsterfashion.in',
      phone: '+917020728378',
      password: 'gangster123',
      role: 'admin',
      adminAlias: 'Shoeb Khan',
      addresses: [{
        street: 'Main Bazaar Road',
        city: 'Kamptee',
        state: 'Maharashtra',
        pincode: '441001',
        landmark: 'Near Jama Masjid',
        isDefault: true
      }]
    });

    // Create Admin 2: Shan Khan
    const shanAdmin = await User.create({
      name: 'Shan Khan',
      email: 'shan@gangsterfashion.in',
      phone: '+918605337906',
      password: 'gangster123',
      role: 'admin',
      adminAlias: 'Shan Khan',
      addresses: [{
        street: 'Station Road',
        city: 'Kamptee',
        state: 'Maharashtra',
        pincode: '441001',
        landmark: 'Opposite Railway Station',
        isDefault: true
      }]
    });

    // Create Sample Customer
    const sampleCustomer = await User.create({
      name: 'Faizan Sheikh',
      email: 'customer@gangsterfashion.in',
      phone: '+919876543210',
      password: 'customer123',
      role: 'customer',
      addresses: [{
        street: 'Sadar Bazar, Near Residency Road',
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
        landmark: 'Near Haldirams',
        isDefault: true
      }]
    });

    console.log('[Seed] Initializing Store Settings & Announcement Bar...');
    const storeSetting = await StoreSetting.create({
      announcementText: '🔥 FREE DELIVERY IN KAMPTEE & NAGPUR ON ORDERS ABOVE ₹999 | ORDER ON WHATSAPP: +91 7020728378',
      announcementActive: true,
      freeShippingThreshold: 999,
      standardShippingFee: 49,
      codEnabled: true,
      onlinePaymentDiscountPercent: 5,
      primaryContactShoeb: {
        name: 'Shoeb Khan',
        phone: '+917020728378',
        whatsapp: '917020728378',
        role: 'Co-Founder & Operations'
      },
      primaryContactShan: {
        name: 'Shan Khan',
        phone: '+918605337906',
        whatsapp: '918605337906',
        role: 'Co-Founder & Creative Lead'
      },
      storeLocation: {
        address: 'Main Market, Station Road',
        city: 'Kamptee',
        state: 'Maharashtra',
        pincode: '441001'
      }
    });

    console.log('[Seed] Seeding Premium Streetwear Catalog...');
    const productsData = [
      {
        title: 'Cyberpunk Tokyo Oversized Graphic Drop-Shoulder Tee',
        slug: 'cyberpunk-tokyo-oversized-graphic-drop-shoulder-tee',
        description: '240 GSM heavy French Terry cotton with high-definition matte Japanese typography print on chest and back. Boxy relaxed drop-shoulder streetwear fit designed for the ultimate drip.',
        category: 'T-Shirts',
        subCategory: 'Oversized Tees',
        mrp: 999,
        price: 399,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Pitch Black', 'Charcoal Grey', 'Vintage Cream'],
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 25,
        badge: 'TOP SELLER @ ₹399',
        rating: 4.9,
        numReviews: 42,
        isFeatured: true,
        tags: ['oversized', 'drop shoulder', 'graphic tee', 'tokyo', 'streetwear', 'under399']
      },
      {
        title: 'Vintage Acid Wash "No Mercy" Heavyweight Boxy Tee',
        slug: 'vintage-acid-wash-no-mercy-heavyweight-boxy-tee',
        description: 'Distressed vintage acid wash finish with ribbed crew neckline. Soft breathable premium fabric with raw street aesthetic. Perfect for gym pump covers and streetwear layering.',
        category: 'T-Shirts',
        subCategory: 'Acid Wash Tees',
        mrp: 1099,
        price: 449,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Acid Charcoal', 'Washed Olive', 'Faded Brown'],
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 18,
        badge: 'HOT DROP',
        rating: 4.8,
        numReviews: 31,
        isFeatured: true,
        tags: ['acid wash', 'vintage tee', 'heavyweight', 'streetwear']
      },
      {
        title: 'Minimalist "The Gang" Heavy Knit Polo Tee',
        slug: 'minimalist-the-gang-heavy-knit-polo-tee',
        description: 'Waffle-knit luxury textured cotton polo with zipper placket and tailored relaxed cuffs. Premium Italian-inspired streetwear polo suitable for casual evenings and luxury drip.',
        category: 'T-Shirts',
        subCategory: 'Polo & Knits',
        mrp: 1299,
        price: 499,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Jet Black', 'Sage Green', 'Crimson Maroon'],
        images: [
          'https://images.unsplash.com/photo-1625910513413-546343516548?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 15,
        badge: 'NEW ARRIVAL',
        rating: 4.7,
        numReviews: 19,
        isFeatured: false,
        tags: ['polo', 'knit polo', 'waffle tee', 'luxury street']
      },
      {
        title: 'Urban Corduroy Overshirt Jacket - Deep Olive',
        slug: 'urban-corduroy-overshirt-jacket-deep-olive',
        description: '100% thick wale corduroy fabric with double front utility flap pockets and custom matte black brass buttons. Heavyweight construction that wears comfortably as a shirt or lightweight streetwear jacket.',
        category: 'Shirts',
        subCategory: 'Corduroy Overshirts',
        mrp: 1499,
        price: 599,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Deep Olive', 'Midnight Black', 'Tan Caramel'],
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 14,
        badge: 'TRENDING',
        rating: 4.9,
        numReviews: 54,
        isFeatured: true,
        tags: ['corduroy', 'overshirt', 'jacket', 'winterwear', 'under599']
      },
      {
        title: 'Matte Black Cuban Collar Textured Resort Shirt',
        slug: 'matte-black-cuban-collar-textured-resort-shirt',
        description: 'Breathable crinkle linen-cotton blend with a retro Cuban camp collar. Styled with drop shoulders and a relaxed drape. Essential streetwear party and vacation shirt.',
        category: 'Shirts',
        subCategory: 'Cuban Shirts',
        mrp: 1199,
        price: 499,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Pitch Black', 'Off White', 'Crimson Red'],
        images: [
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 20,
        badge: 'RESTOCKED',
        rating: 4.8,
        numReviews: 27,
        isFeatured: false,
        tags: ['cuban shirt', 'resort shirt', 'textured', 'casual shirt']
      },
      {
        title: 'Tactical 6-Pocket Street Cargo Pants - Matte Charcoal',
        slug: 'tactical-6-pocket-street-cargo-pants-matte-charcoal',
        description: 'Heavy duty ripstop cotton tactical pants with deep expanding cargo pockets, elastic waistband with drawstrings, and toggle ankle cuffs. The definitive streetwear silhouette.',
        category: 'Cargo & Pants',
        subCategory: 'Tactical Cargoes',
        mrp: 1699,
        price: 699,
        sizes: ['30', '32', '34', '36', '38', '40'],
        colors: ['Matte Charcoal', 'Tactical Black', 'Army Green'],
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 22,
        badge: 'BESTSELLER',
        rating: 4.9,
        numReviews: 68,
        isFeatured: true,
        tags: ['cargo', 'tactical pants', 'streetwear bottom', 'big size']
      },
      {
        title: 'Imported Wide-Leg Baggy Street Denim Jeans',
        slug: 'imported-wide-leg-baggy-street-denim-jeans',
        description: 'Heavy 13.5 oz non-stretch imported denim with authentic 90s skater baggy silhouette, clean wash, and custom gangster hardware buttons. Sits comfortably at waist and stacks cleanly over shoes.',
        category: 'Jeans',
        subCategory: 'Baggy Jeans',
        mrp: 1899,
        price: 799,
        sizes: ['30', '32', '34', '36', '38', '40', '42'],
        colors: ['Vintage Light Blue', 'Midnight Black', 'Smoke Grey'],
        images: [
          'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 16,
        badge: 'IMPORTED FIT',
        rating: 4.8,
        numReviews: 45,
        isFeatured: true,
        tags: ['baggy jeans', 'wide leg', 'denim', 'imported', 'big size 42']
      },
      {
        title: 'Distressed Knee-Ripped Slim Fit Streetwear Jeans',
        slug: 'distressed-knee-ripped-slim-fit-streetwear-jeans',
        description: 'Stretch denim with raw knee distress abrasions, paint splatter detailing, and tapered ankle fit. Flexible and comfortable for all-day wear with high-top sneakers.',
        category: 'Jeans',
        subCategory: 'Distressed Jeans',
        mrp: 1799,
        price: 749,
        sizes: ['30', '32', '34', '36', '38'],
        colors: ['Distressed Blue', 'Washed Black'],
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 12,
        badge: 'LIMITED STOCK',
        rating: 4.7,
        numReviews: 22,
        isFeatured: false,
        tags: ['ripped jeans', 'distressed denim', 'slim fit']
      },
      {
        title: 'Ultra-Comfort Cloud Foam Street Slides',
        slug: 'ultra-comfort-cloud-foam-street-slides',
        description: 'Molded EVA ultra-cushioned slide sandals with non-slip grooved outsole and ergonomic footbed. Thick 4cm cloud sole for walking in style and absolute comfort.',
        category: 'Footwear',
        subCategory: 'Sliders',
        mrp: 699,
        price: 249,
        sizes: ['6', '7', '8', '9', '10', '11'],
        colors: ['Bone White', 'Matte Black', 'Olive Drab'],
        images: [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 35,
        badge: 'SPECIAL @ ₹249',
        rating: 4.9,
        numReviews: 89,
        isFeatured: true,
        tags: ['slides', 'chappals', 'yeezy slides', 'foam sliders', 'under399']
      },
      {
        title: 'Everyday Urban Street Chappals / Flip Flops',
        slug: 'everyday-urban-street-chappals-flip-flops',
        description: 'Durable rubber strap street flip-flops with anti-skid bottom tread. Super lightweight and budget-friendly daily wear.',
        category: 'Footwear',
        subCategory: 'Chappals',
        mrp: 299,
        price: 99,
        sizes: ['7', '8', '9', '10'],
        colors: ['Red & Black', 'Blue & Grey', 'All Black'],
        images: [
          'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 50,
        badge: 'CRAZY DEAL @ ₹99',
        rating: 4.6,
        numReviews: 120,
        isFeatured: true,
        tags: ['chappals', 'flip flops', 'budget footwear', 'under99']
      },
      {
        title: 'Chunky Steel Cuban Link Streetwear Chain (12mm)',
        slug: 'chunky-steel-cuban-link-streetwear-chain-12mm',
        description: 'High-grade surgical stainless steel diamond-cut Cuban chain with heavy duty lobster clasp. Non-tarnish, waterproof, and sweat-resistant gangster accessory.',
        category: 'Accessories',
        subCategory: 'Jewellery & Chains',
        mrp: 699,
        price: 199,
        sizes: ['18 Inch', '22 Inch', '24 Inch'],
        colors: ['Silver Chrome', 'Burnished Gold'],
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 40,
        badge: 'ACCESSORY MUST-HAVE',
        rating: 4.8,
        numReviews: 76,
        isFeatured: true,
        tags: ['cuban chain', 'jewellery', 'silver chain', 'under399']
      },
      {
        title: 'Gangster Blackout Octagonal UV400 Sunglasses',
        slug: 'gangster-blackout-octagonal-uv400-sunglasses',
        description: 'Retro geometric thick frame sunglasses with 100% UV400 protective polarized black lenses. Sleek metal hinge reinforcements for bold face styling.',
        category: 'Accessories',
        subCategory: 'Sunglasses',
        mrp: 799,
        price: 249,
        sizes: ['Free Size'],
        colors: ['Jet Black', 'Tea Tinted Gold Frame'],
        images: [
          'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 28,
        badge: 'POPULAR',
        rating: 4.7,
        numReviews: 44,
        isFeatured: false,
        tags: ['sunglasses', 'shades', 'accessories', 'under399']
      },
      {
        title: 'Matte Black Multi-Function Tactical Sports Watch',
        slug: 'matte-black-multi-function-tactical-sports-watch',
        description: 'Shockproof water-resistant dual time digital-analog wristwatch with LED backlight, stopwatch, and military-grade resin strap.',
        category: 'Accessories',
        subCategory: 'Watches',
        mrp: 999,
        price: 349,
        sizes: ['Free Size'],
        colors: ['Matte Black', 'Gold Accented Black'],
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 19,
        badge: 'HOT ACCENT',
        rating: 4.8,
        numReviews: 38,
        isFeatured: false,
        tags: ['watch', 'tactical watch', 'sports watch', 'accessories']
      },
      {
        title: 'THE ULTIMATE GANGSTER COMBO: Oversized Tee + Tactical Cargo',
        slug: 'the-ultimate-gangster-combo-oversized-tee-tactical-cargo',
        description: 'Complete street drip set: Get 1 Premium Drop-Shoulder Graphic Tee + 1 6-Pocket Tactical Cargo Pant of your chosen sizes at an unbeatable gangster combo rate.',
        category: 'Combos',
        subCategory: 'Street Combos',
        mrp: 2499,
        price: 999,
        sizes: ['M + 32', 'L + 34', 'XL + 36', 'XXL + 38', 'XXL + 40'],
        colors: ['Black Tee + Charcoal Cargo', 'Cream Tee + Tactical Black Cargo'],
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 15,
        badge: 'MEGA COMBO @ ₹999',
        rating: 5.0,
        numReviews: 112,
        isFeatured: true,
        tags: ['combo', 'combo999', 'tee cargo combo', 'gangster deal', 'under999']
      },
      {
        title: '3-Pack Graphic Streetwear Oversized Tees Super Saver',
        slug: '3-pack-graphic-streetwear-oversized-tees-super-saver',
        description: '3 Handpicked best-selling drop-shoulder t-shirts (Black Tokyo, Acid Grey, Cream Gothic) bundled together at an insane budget price.',
        category: 'Combos',
        subCategory: 'Tee Bundles',
        mrp: 2999,
        price: 999,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['3-Tee Assorted Pack'],
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
        ],
        stock: 20,
        badge: 'SAVER @ ₹999',
        rating: 4.9,
        numReviews: 87,
        isFeatured: true,
        tags: ['combo', '3 pack tees', 'combo999', 'budget deal']
      }
    ];

    const seededProducts = await Product.insertMany(productsData);
    console.log(`[Seed] Successfully created ${seededProducts.length} Streetwear Products!`);

    console.log('[Seed] Seeding Sample Orders for Live Tracking & Admin Pipeline Demonstration...');
    
    // Sample Order 1: Dispatched (Ordered by customer Faizan)
    const order1 = await Order.create({
      orderId: 'GM-2026-1001',
      user: sampleCustomer._id,
      customer: {
        name: 'Faizan Sheikh',
        phone: '+919876543210',
        email: 'customer@gangsterfashion.in',
        address: {
          street: 'Sadar Bazar, Near Residency Road',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001',
          landmark: 'Near Haldirams'
        }
      },
      items: [
        {
          product: seededProducts[0]._id,
          title: seededProducts[0].title,
          slug: seededProducts[0].slug,
          size: 'XL',
          color: 'Pitch Black',
          price: seededProducts[0].price,
          mrp: seededProducts[0].mrp,
          quantity: 2,
          image: seededProducts[0].images[0]
        },
        {
          product: seededProducts[8]._id,
          title: seededProducts[8].title,
          slug: seededProducts[8].slug,
          size: '9',
          color: 'Bone White',
          price: seededProducts[8].price,
          mrp: seededProducts[8].mrp,
          quantity: 1,
          image: seededProducts[8].images[0]
        }
      ],
      itemsPrice: 1047,
      shippingPrice: 0,
      totalAmount: 1047,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'DISPATCHED',
      processedBy: 'Shoeb Khan',
      carrier: 'Nagpur Metro Express',
      trackingNumber: 'NME-KPT-89421',
      notes: 'Customer requested evening delivery after 6 PM',
      statusHistory: [
        { status: 'PLACED', updatedBy: 'Customer', comment: 'Order placed via COD', timestamp: new Date(Date.now() - 36 * 3600 * 1000) },
        { status: 'PACKED', updatedBy: 'Shoeb Khan', comment: 'Carefully packaged with gangster brand stickers', timestamp: new Date(Date.now() - 24 * 3600 * 1000) },
        { status: 'DISPATCHED', updatedBy: 'Shan Khan', comment: 'Handed to courier partner Nagpur Metro Express', timestamp: new Date(Date.now() - 12 * 3600 * 1000) }
      ]
    });

    // Sample Order 2: Packed (Customer from Kamptee)
    const order2 = await Order.create({
      orderId: 'GM-2026-1002',
      customer: {
        name: 'Arbaz Qureshi',
        phone: '+917020728378',
        email: 'arbaz@gmail.com',
        address: {
          street: 'Kathi Pura, Station Road',
          city: 'Kamptee',
          state: 'Maharashtra',
          pincode: '441001',
          landmark: 'Near Jama Masjid'
        }
      },
      items: [
        {
          product: seededProducts[13]._id,
          title: seededProducts[13].title,
          slug: seededProducts[13].slug,
          size: 'L + 34',
          color: 'Black Tee + Charcoal Cargo',
          price: seededProducts[13].price,
          mrp: seededProducts[13].mrp,
          quantity: 1,
          image: seededProducts[13].images[0]
        }
      ],
      itemsPrice: 999,
      shippingPrice: 0,
      totalAmount: 999,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'PAID',
      razorpayPaymentId: 'pay_gangster_live_8941',
      orderStatus: 'PACKED',
      processedBy: 'Shan Khan',
      statusHistory: [
        { status: 'PLACED', updatedBy: 'Customer', comment: 'Paid via Razorpay UPI', timestamp: new Date(Date.now() - 8 * 3600 * 1000) },
        { status: 'PACKED', updatedBy: 'Shan Khan', comment: 'Combo packed and ready for dispatch in Kamptee', timestamp: new Date(Date.now() - 2 * 3600 * 1000) }
      ]
    });

    // Sample Order 3: Placed
    const order3 = await Order.create({
      orderId: 'GM-2026-1003',
      customer: {
        name: 'Sameer Siddiqui',
        phone: '+918605337906',
        email: 'sameer@gmail.com',
        address: {
          street: 'Civil Lines, Near High Court',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001',
          landmark: 'Beside CCD'
        }
      },
      items: [
        {
          product: seededProducts[3]._id,
          title: seededProducts[3].title,
          slug: seededProducts[3].slug,
          size: 'XL',
          color: 'Deep Olive',
          price: seededProducts[3].price,
          mrp: seededProducts[3].mrp,
          quantity: 1,
          image: seededProducts[3].images[0]
        }
      ],
      itemsPrice: 599,
      shippingPrice: 49,
      totalAmount: 648,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      processedBy: 'System Auto-Intake',
      statusHistory: [
        { status: 'PLACED', updatedBy: 'Customer', comment: 'New COD order received', timestamp: new Date(Date.now() - 30 * 60 * 1000) }
      ]
    });

    console.log('[Seed] Seeding Initial Admin Activity Logs...');
    await AdminActivity.create([
      {
        adminName: 'Shoeb Khan',
        adminEmail: 'shoeb@gangsterfashion.in',
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'ORDER',
        entityId: 'GM-2026-1001',
        details: 'Shoeb Khan marked Order #GM-2026-1001 as DISPATCHED via Nagpur Metro Express',
        ipAddress: '127.0.0.1'
      },
      {
        adminName: 'Shan Khan',
        adminEmail: 'shan@gangsterfashion.in',
        action: 'UPDATE_ORDER_STATUS',
        entityType: 'ORDER',
        entityId: 'GM-2026-1002',
        details: 'Shan Khan marked Order #GM-2026-1002 as PACKED and prepared parcel',
        ipAddress: '127.0.0.1'
      },
      {
        adminName: 'Shoeb Khan',
        adminEmail: 'shoeb@gangsterfashion.in',
        action: 'CREATE_PRODUCT',
        entityType: 'PRODUCT',
        entityId: seededProducts[13]._id.toString(),
        details: 'Shoeb Khan added new combo: "THE ULTIMATE GANGSTER COMBO" @ ₹999',
        ipAddress: '127.0.0.1'
      }
    ]);

    console.log('====================================================');
    console.log('🔥 GANGSTER MENSWEAR DATABASE SEED COMPLETED! 🔥');
    console.log('Dual-Admin Logins:');
    console.log('1. Shoeb Khan:  shoeb@gangsterfashion.in  / gangster123');
    console.log('2. Shan Khan:   shan@gangsterfashion.in   / gangster123');
    console.log('Customer Login: customer@gangsterfashion.in / customer123');
    console.log('====================================================');

    return { success: true };
  } catch (error) {
    console.error(`[Seed] Error seeding database: ${error.message}`);
    throw error;
  }
};

// If run directly via node seed/seedData.js
if (process.argv[1].endsWith('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  })();
}
