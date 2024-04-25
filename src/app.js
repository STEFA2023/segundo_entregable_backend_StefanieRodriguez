const express = require('express');
const fs = require('fs');
const ProductManager = require('./productManager');


const app = express();
app.use(express.json());
const productManager = new ProductManager();
const cartsRouter = require('./cart');
app.use('/api/carts', cartsRouter);



app.get('/api/products', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.post('/api/products', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const newProduct = { id: Date.now().toString(), title, description, code, price, stock, category, thumbnails, status: true };
    productManager.addProduct(newProduct);
    res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
});


app.put('/api/products/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    res.json({ message: 'Producto actualizado correctamente' });
});

app.delete('/api/products/:pid', (req, res) => {
    const productId = req.params.pid;
    productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente' });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;