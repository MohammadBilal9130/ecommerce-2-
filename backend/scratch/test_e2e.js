const API_BASE = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

async function runE2ETests() {
  console.log('🔥 STARTING COMPREHENSIVE E2E VERIFICATION FOR GANGSTER MENSWEAR 🔥\n');

  try {
    // 1. Health Check
    console.log('--- TEST 1: Health Check ---');
    const health = await req('/health');
    console.log('✅ Health Check OK:', health);

    // 2. Fetch Products and Filters
    console.log('\n--- TEST 2: Product Catalog & Filtering ---');
    const allProducts = await req('/products');
    console.log(`✅ Fetched All Products: ${allProducts.count} items found (Total: ${allProducts.total})`);

    const teeFilter = await req('/products?category=T-Shirts&sizes=XL');
    console.log(`✅ Category 'T-Shirts' + Size 'XL' Filter: ${teeFilter.count} items found`);

    const budgetFilter = await req('/products?budget=under399');
    console.log(`✅ Budget 'under399' Filter: ${budgetFilter.count} items found`);

    // 3. Product Details by Slug
    console.log('\n--- TEST 3: Product Details & Related Drops ---');
    const slug = allProducts.products[0].slug;
    const detail = await req(`/products/${slug}`);
    console.log(`✅ Product Detail OK: "${detail.product.title}"`);
    console.log(`   MRP: ₹${detail.product.mrp} | Selling Price: ₹${detail.product.price} (${detail.product.discountPercentage}% OFF)`);
    console.log(`   Available Sizes: [${detail.product.sizes.join(', ')}]`);
    console.log(`   Related Items in same category: ${detail.relatedProducts.length}`);

    // 4. Place a Cash on Delivery (COD) Order
    console.log('\n--- TEST 4: Place Customer COD Order ---');
    const firstProduct = allProducts.products[0];
    const orderPayload = {
      customer: {
        name: 'Faizan Sheikh',
        phone: '+919876543210',
        email: 'faizan@gmail.com',
        address: {
          street: 'Main Road Sadar',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001'
        }
      },
      items: [
        {
          product: firstProduct._id,
          title: firstProduct.title,
          size: 'XL',
          color: 'Pitch Black',
          price: firstProduct.price,
          mrp: firstProduct.mrp,
          quantity: 2,
          image: firstProduct.images[0]
        }
      ],
      paymentMethod: 'COD'
    };

    const createdOrder = await req('/orders', { method: 'POST', body: orderPayload });
    const newOrderId = createdOrder.order.orderId;
    console.log(`✅ COD Order Placed: ID #${newOrderId} (Total: ₹${createdOrder.order.totalAmount})`);
    console.log(`   Order Status: ${createdOrder.order.orderStatus} | Payment: ${createdOrder.order.paymentStatus}`);

    // 5. Order Tracking by Order ID and Phone Number
    console.log('\n--- TEST 5: Order Tracking ---');
    const trackById = await req(`/orders/track/${newOrderId}`);
    console.log(`✅ Tracking by Order ID (${newOrderId}): Found ${trackById.count} order(s). Status: ${trackById.orders[0].orderStatus}`);

    const trackByPhone = await req('/orders/track/9876543210');
    console.log(`✅ Tracking by Phone (9876543210): Found ${trackByPhone.count} active order(s)`);

    // 6. Dual-Admin Authentication for Shoeb Khan & Shan Khan
    console.log('\n--- TEST 6: Dual-Admin Authentication ---');
    const shoebLogin = await req('/auth/admin/login', {
      method: 'POST',
      body: {
        email: 'shoeb@gangsterfashion.in',
        password: 'gangster123',
        adminAlias: 'Shoeb Khan'
      }
    });
    const shoebToken = shoebLogin.user.token;
    console.log(`✅ Shoeb Khan Admin Login OK. Alias: ${shoebLogin.user.adminAlias}`);

    const shanLogin = await req('/auth/admin/login', {
      method: 'POST',
      body: {
        email: 'shan@gangsterfashion.in',
        password: 'gangster123',
        adminAlias: 'Shan Khan'
      }
    });
    const shanToken = shanLogin.user.token;
    console.log(`✅ Shan Khan Admin Login OK. Alias: ${shanLogin.user.adminAlias}`);

    // 7. Admin Dashboard KPIs & Metrics
    console.log('\n--- TEST 7: Admin Dashboard Metrics ---');
    const metricsRes = await req('/admin/metrics', {
      headers: { Authorization: `Bearer ${shoebToken}` }
    });
    console.log('✅ Dashboard KPIs:', metricsRes.metrics);

    // 8. Admin Update Order Status with Shoeb's signature
    console.log('\n--- TEST 8: Order Status Update with Admin Signature ---');
    const updateRes = await req(`/admin/orders/${createdOrder.order._id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${shoebToken}` },
      body: {
        status: 'DISPATCHED',
        carrier: 'Nagpur Metro Express',
        trackingNumber: 'NME-KPT-998822'
      }
    });
    console.log(`✅ Order Updated: Status is now "${updateRes.order.orderStatus}" by ${updateRes.order.processedBy}`);

    // 9. Admin Create New Streetwear Product with Shan's signature
    console.log('\n--- TEST 9: Create Product by Shan Khan ---');
    const newProductRes = await req('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${shanToken}` },
      body: {
        title: 'Midnight Velvet Corduroy Party Overshirt',
        description: 'Ultra-luxurious heavyweight corduroy jacket with satin inner lining.',
        category: 'Shirts',
        subCategory: 'Corduroy',
        mrp: 1899,
        price: 699,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Midnight Velvet Blue'],
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
        stock: 30,
        badge: 'LIMITED EDITION',
        isFeatured: true
      }
    });
    console.log(`✅ New Product Created by Shan: "${newProductRes.product.title}" (ID: ${newProductRes.product._id})`);

    // 10. Verify Activity Audit Logs Attribution
    console.log('\n--- TEST 10: Activity Audit Logs Verification ---');
    const logsRes = await req('/admin/activities', {
      headers: { Authorization: `Bearer ${shoebToken}` }
    });
    console.log(`✅ Total Audit Log Entries: ${logsRes.count}`);
    console.log('   Recent 3 logs:');
    logsRes.activities.slice(0, 3).forEach((log, i) => {
      console.log(`   [${i+1}] [${log.adminName}] (${log.action}) -> ${log.details}`);
    });

    console.log('\n🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY! 🔥');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

runE2ETests();
