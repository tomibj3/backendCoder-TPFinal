import mongoose from 'mongoose';

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    required: false
  }
});

// Método estático para la paginación
productSchema.statics.paginate = async function(query, options) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const sort = options.sort || {};

  const totalDocs = await this.countDocuments(query).exec();
  const totalPages = Math.ceil(totalDocs / limit);
  const docs = await this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return {
    totalDocs,
    totalPages,
    page,
    limit,
    docs
  };
};

const Product = mongoose.model('Product', productSchema);

export default Product;
