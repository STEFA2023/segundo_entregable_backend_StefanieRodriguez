import { Router } from 'express';
import config from '../config.js';
import productManager from '../productManager.js';
import ProductsManager from '../dao/products.manager.mdb.js';
import UsersManager from '../dao/users.manager.mdb.js';
import usersModel from '../dao/models/users.model.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();
const manager = new ProductsManager();

router.get('/chat', (req, res) => {
    res.render('chat', {});
});


router.get('/realTimeProducts/:page', async (req, res) => {
    const data = await manager.getAll(config.PRODUCTS_PER_PAGE, req.params.page);
    res.render('realTimeProducts', {data: data});
});

router.get('/index', async (req, res) => {
    try {
        const products = await productsModel.find();  
        res.render('index', { products });  
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await usersModel.find();
        console.log(users); 
        res.render('users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

router.get('/register', (req, res) => {
    res.render('register', {});
});

router.get('/login', (req, res) => {
    
    if (req.session.user) return res.redirect('/profile');
    res.render('login', { showError: req.query.error ? true: false, errorMessage: req.query.error });
});

router.get('/profile', (req, res) => {
    
    if (!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
});


router.get('/products', async (req, res) => {
    try {
        const products = await productsModel.find();
        console.log(products); 
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});
router.get('/carts', async (req, res) => {
    try {
        const carts = await cartsModel.find();
        console.log(carts); 
        res.render('carts', { carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).send('Error fetching carts');
    }
});
router.get('/chat', (req, res) =>{
    res.render('chat');
});

export default router;