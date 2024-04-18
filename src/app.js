const express = require('express');
const fs = require('fs');
const ProductManager = require('./productManager');


const app = express();
const productManager = new ProductManager();



app.get('/products', async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/products/:pid', async (req, res) => {
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;