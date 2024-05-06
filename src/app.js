import { fileURLToPath } from 'url';

import path from 'path';

import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
//import fs from 'fs';
import {ProductManager} from './productManager.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIo(server);
//app.set('views', path.join(__dirname, 'views'));

//app.engine('handlebars', exphbs.engine());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'handlebars');


app.use(express.json());

const productManager = new ProductManager();

import {cartsRouter} from './cart.js';

app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('productCreated', () => {
        io.emit('updateProducts');
    });

    socket.on('productDeleted', () => {
        io.emit('updateProducts');
    });
});


app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

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

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
