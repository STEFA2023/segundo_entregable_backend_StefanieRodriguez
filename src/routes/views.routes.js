import { Router } from 'express';
import productManager from '../productManager.js';
import usersModel from '../dao/models/users.model.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { products });
});

router.get('/realTimeProducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {});
});

router.get('/index', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('index', { products });
});

//router.get('/users', async (req, res) =>{
    //const users = await usersModel.find();
    //res.render('users', { users });
//});

router.get('/users', async (req, res) => {
    try {
        const users = await usersModel.find();
        console.log(users); // Log para verificar los datos
        res.render('users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

router.get('/products', async (req, res) => {
    try {
        const products = await productsModel.find();
        console.log(products); // Log para verificar los datos
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});
router.get('/chat', (req, res) =>{
    res.render('chat', {});
});

export default router;