import Product from '../models/Product.js';
import AdminActivity from '../models/AdminActivity.js';

// Helper to generate a slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Get all products with filtering, search, pagination, and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      size,
      sizes,
      minPrice,
      maxPrice,
      search,
      sort,
      isFeatured,
      budget,
      page = 1,
      limit = 24
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // SubCategory
    if (subCategory) {
      query.subCategory = new RegExp(subCategory, 'i');
    }

    // Size filter (single or comma-separated)
    const targetSizes = sizes ? sizes.split(',') : (size ? [size] : null);
    if (targetSizes && targetSizes.length > 0) {
      query.sizes = { $in: targetSizes };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Budget shortcut filters
    if (budget === 'under399') {
      query.price = { ...(query.price || {}), $lte: 399 };
    } else if (budget === 'under599') {
      query.price = { ...(query.price || {}), $lte: 599 };
    } else if (budget === 'under999') {
      query.price = { ...(query.price || {}), $lte: 999 };
    }

    // Featured flag
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Text search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subCategory: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sort === 'discount') {
      sortOptions = { discountPercentage: -1 };
    } else if (sort === 'featured') {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug or id, with related items
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    let product;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId);
    }
    if (!product) {
      product = await Product.findOne({ slug: slugOrId });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Find related drops in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      mrp,
      price,
      sizes,
      colors,
      images,
      stock,
      badge,
      isFeatured,
      isActive,
      tags
    } = req.body;

    const slug = generateSlug(title);

    const product = await Product.create({
      title,
      slug,
      description,
      category,
      subCategory: subCategory || 'Streetwear',
      mrp: Number(mrp),
      price: Number(price),
      sizes: Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim()),
      colors: Array.isArray(colors) ? colors : (colors ? colors.split(',').map(c => c.trim()) : ['Black']),
      images: Array.isArray(images) ? images : [images],
      stock: Number(stock) || 20,
      badge: badge || 'NEW DROP',
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['streetwear'])
    });

    const adminName = req.user.adminAlias || req.user.name || 'Admin';

    // Log admin activity
    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'CREATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: product._id.toString(),
      details: `${adminName} added new product: "${product.title}" (${product.category}) @ ₹${product.price}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      title,
      description,
      category,
      subCategory,
      mrp,
      price,
      sizes,
      colors,
      images,
      stock,
      badge,
      isFeatured,
      isActive,
      tags
    } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (mrp !== undefined) product.mrp = Number(mrp);
    if (price !== undefined) product.price = Number(price);
    if (sizes) product.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim());
    if (colors) product.colors = Array.isArray(colors) ? colors : colors.split(',').map(c => c.trim());
    if (images) product.images = Array.isArray(images) ? images : [images];
    if (stock !== undefined) product.stock = Number(stock);
    if (badge !== undefined) product.badge = badge;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (tags) product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    if (product.mrp && product.price && product.mrp > product.price) {
      product.discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }

    const updatedProduct = await product.save();
    const adminName = req.user.adminAlias || req.user.name || 'Admin';

    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'UPDATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: updatedProduct._id.toString(),
      details: `${adminName} updated product: "${updatedProduct.title}" (Price: ₹${updatedProduct.price}, Stock: ${updatedProduct.stock})`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const title = product.title;
    await Product.findByIdAndDelete(req.params.id);

    const adminName = req.user.adminAlias || req.user.name || 'Admin';

    await AdminActivity.create({
      adminName,
      adminEmail: req.user.email,
      action: 'DELETE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: req.params.id,
      details: `${adminName} deleted product: "${title}"`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({
      success: true,
      message: 'Product removed from catalog'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Category summary & counts
// @route   GET /api/products/categories/summary
// @access  Public
export const getCategoriesSummary = async (req, res) => {
  try {
    const categories = [
      { name: 'T-Shirts', banner: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80', description: 'Oversized & Graphic Streetwear Tees' },
      { name: 'Shirts', banner: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80', description: 'Corduroy, Flannels & Casual Fits' },
      { name: 'Jeans', banner: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80', description: 'Baggy, Wide-Leg & Distressed Denims' },
      { name: 'Cargo & Pants', banner: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80', description: 'Multi-Pocket Street Cargoes' },
      { name: 'Footwear', banner: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80', description: 'Urban Sliders, Chappals & Sneakers' },
      { name: 'Accessories', banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', description: 'Chains, Caps, Shades & Watches' },
      { name: 'Combos', banner: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80', description: 'Tee + Cargo Street Deals @ ₹999' }
    ];

    const counts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const enrichedCategories = categories.map(cat => ({
      ...cat,
      itemCount: countMap[cat.name] || 0
    }));

    res.json({
      success: true,
      categories: enrichedCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
