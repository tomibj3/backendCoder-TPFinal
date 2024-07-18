import express from 'express';
import CartManager from '../controllers/cart-manager.js';

const router = express.Router();

export default (io) => {
    router.post('/', async (req, res) => {
        const cart = await CartManager.createCart();
        io.emit('newCart');
        res.json(cart);
    });

    router.get('/:cid', async (req, res) => {
        const cart = await CartManager.getCartById(req.params.cid);
        res.json(cart);
    });

    router.put('/:cid', async (req, res) => {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await CartManager.updateCart(cid, products);
        io.emit('updateCart');
        res.json(updatedCart);
    });

    router.delete('/:cid', async (req, res) => {
        const { cid } = req.params;
        await CartManager.deleteCart(cid);
        io.emit('clearCart');
        res.json({ message: 'Carrito vaciado' });
    });

    router.delete('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params;
        await CartManager.deleteProductFromCart(cid, pid);
        io.emit('deleteProductFromCart');
        res.json({ message: 'Producto eliminado del carrito' });
    });

    router.put('/:cid/products/:pid', async (req, res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await CartManager.updateProductQuantity(cid, pid, quantity);
        io.emit('updateProductQuantity');
        res.json(updatedCart);
    });

    return router;
};
