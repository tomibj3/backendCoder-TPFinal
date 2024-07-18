import express from 'express';
import ProductManager from '../controllers/product-manager.js';

const router = express.Router();

export default (io) => {
    router.get('/', async (req, res) => {
        // Obtener los productos con filtros, paginación y ordenamiento
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };
        const filter = query ? { $or: [{ category: query }, { status: query }] } : {};

        try {
            const products = await ProductManager.getProducts(filter, options);
            res.json({
                status: 'success',
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `?page=${products.prevPage}` : null,
                nextLink: products.hasNextPage ? `?page=${products.nextPage}` : null
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    router.get('/:id', async (req, res) => {
        const product = await ProductManager.getProductById(req.params.id);
        res.json(product);
    });

    router.post('/', async (req, res) => {
        const product = await ProductManager.createProduct(req.body);
        io.emit('newProduct');
        res.json(product);
    });

    router.put('/:id', async (req, res) => {
        const product = await ProductManager.updateProduct(req.params.id, req.body);
        io.emit('updateProduct');
        res.json(product);
    });

    router.delete('/:id', async (req, res) => {
        await ProductManager.deleteProduct(req.params.id);
        io.emit('deleteProduct');
        res.json({ message: 'Producto eliminado' });
    });

    return router;
};
