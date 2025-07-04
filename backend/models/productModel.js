import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['appetizers', 'main-course', 'desserts', 'beverages', 'pizza', 'burgers', 'salads', 'chinese', 'indian', 'italian', 'mexican', 'fast-food', 'healthy', 'vegetarian', 'vegan'],
    },
    restaurant: {
      type: String,
      required: true,
    },
    servingSize: {
      type: String,
      default: '',
    },
    ingredients: [
      {
        type: String,
      },
    ],
    allergens: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    features: [String],
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    preparationTime: {
      type: Number, // in minutes
      default: 0,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'very-hot', 'none'],
      default: 'none',
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;