import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    
    // Search query
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    
    // Category filter
    const category = req.query.category ? { category: req.query.category } : {};
    
    // Price range filter
    const priceFilter = {};
    if (req.query.minPrice) {
      priceFilter.price = { ...priceFilter.price, $gte: Number(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
    }
    
    // Size filter (product.sizes array contains the requested size)
    const sizeFilter = {};
    if (req.query.sizes) {
      // Handle multiple sizes as comma-separated values
      const sizes = req.query.sizes.split(',').map(size => size.trim());
      if (sizes.length > 0) {
        sizeFilter.sizes = { $in: sizes };
      }
    } else if (req.query.size) {
      // Handle single size parameter for backward compatibility
      sizeFilter.sizes = req.query.size;
    }
    
    // Color filter (product.colors array contains the requested color)
    const colorFilter = {};
    if (req.query.colors) {
      // Handle multiple colors as comma-separated values
      const colors = req.query.colors.split(',').map(color => color.trim());
      if (colors.length > 0) {
        colorFilter.colors = { $in: colors };
      }
    } else if (req.query.color) {
      // Handle single color parameter for backward compatibility
      colorFilter.colors = req.query.color;
    }
    
    // Brand filter
    const brandFilter = req.query.brand ? { brand: req.query.brand } : {};
    
    // Build the query
    const query = {
      ...keyword,
      ...category,
      ...priceFilter,
      ...sizeFilter,
      ...colorFilter,
      ...brandFilter
    };
    
    // Sort options
    let sortOption = { createdAt: -1 }; // default newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low-high':
          sortOption = { price: 1 };
          break;
        case 'price-high-low':
          sortOption = { price: -1 };
          break;
        case 'name-a-z':
          sortOption = { name: 1 };
          break;
        case 'name-z-a':
          sortOption = { name: -1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
      }
    }
    
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(sortOption);
    
    res.json({ 
      products, 
      page, 
      pages: Math.ceil(count / pageSize), 
      total: count 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      
      if (alreadyReviewed) {
        res.status(400).json({ message: 'Product already reviewed' });
        return;
      }
      
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      
      product.reviews.push(review);
      
      product.numReviews = product.reviews.length;
      
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      
      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(limit);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      countInStock,
      features,
      sizes,
      colors,
      discountPercentage,
      isNew
    } = req.body;

    const product = new Product({
      name,
      price,
      user: req.user._id,
      images: images || [],
      brand,
      category,
      description,
      countInStock: countInStock || 0,
      features: features || [],
      sizes: sizes || [],
      colors: colors || [],
      discountPercentage: discountPercentage || 0,
      isNew: isNew || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      countInStock,
      features,
      sizes,
      colors,
      discountPercentage,
      isNew
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.features = features || product.features;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
      product.isNew = isNew !== undefined ? isNew : product.isNew;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getProducts, getProductById, createProductReview, getTopProducts, createProduct, updateProduct, deleteProduct };