import { Router } from 'express';
//import productManager from '../productManager.js';
//import { uploader } from '../uploader';
import productsModel from '../dao/models/products.model.js';
//import config from '../config';

const router = Router();


router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productsModel.find().limit(limit);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/api/products', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productsModel.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/api/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productsModel.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/api/products', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const newProduct = { id: Date.now().toString(), title, description, code, price, stock, category, thumbnails, status: true };
    productsModel.addProduct(newProduct);
    res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
});

router.put('/api/products/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;
    productsModel.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado correctamente' });
});

router.delete('/api/products/:pid', (req, res) => {
    const productId = req.params.pid;
    productsModel.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente' });
});



export default router;