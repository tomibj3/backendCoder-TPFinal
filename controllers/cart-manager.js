import Cart from '../models/cart.js';
import Product from '../models/product.js';

// Clase para gestionar los carritos
class CartManager {
    
    // Crear un nuevo carrito
    async createCart() {
        try {
            const cart = new Cart({ products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    // Obtener los productos de un carrito específico
    async getCartProducts(cartId) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart.products;
        } catch (error) {
            throw new Error('Error al obtener los productos del carrito: ' + error.message);
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                cart.products.push({ product: productId, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito: ' + error.message);
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar la cantidad del producto en el carrito: ' + error.message);
        }
    }

    // Actualizar el carrito con un arreglo de productos
    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = products;
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    // Eliminar todos los productos del carrito
    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al vaciar el carrito: ' + error.message);
        }
    }
}

export default CartManager;
