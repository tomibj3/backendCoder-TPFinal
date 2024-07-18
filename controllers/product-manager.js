import Product from '../models/product.js';

class ProductManager {
    async getProducts(filter, options) {
        return await Product.paginate(filter, options);
    }

    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductManager();
