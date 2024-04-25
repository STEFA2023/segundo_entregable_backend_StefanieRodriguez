const express = require('express');
const fs = require('fs');

const cartsRouter = express.Router();


const carts = {};

cartsRouter.post('/', (req, res) => {
    const cartId = Date.now().toString(); 
    const newCart = { id: cartId, products: [] };
    carts[cartId] = newCart;
    res.status(201).json({ message: 'Carrito creado correctamente', cart: newCart });
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts[cartId];
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!carts[cartId]) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }

    const existingProductIndex = carts[cartId].products.findIndex(item => item.id === productId);
    if (existingProductIndex !== -1) {
        
        carts[cartId].products[existingProductIndex].quantity += quantity;
    } else {
        
        carts[cartId].products.push({ id: productId, quantity });
    }
    res.json({ message: 'Producto agregado al carrito correctamente', cart: carts[cartId] });
});

module.exports = cartsRouter;
