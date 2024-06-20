import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import config from './config.js';
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import viewsRouter from './routes/views.routes.js';
import http from 'http';

const app = express();

let messages = [];

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configura Handlebars y permite el acceso a las propiedades de los prototipos
app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
//
//app.engine('handlebars', handlebars.engine());
app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');


app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));


const server = http.createServer(app);
const io = new Server(server);

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


const httpServer = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Servidor escuchando en el puerto ${config.PORT} enlazada a bbdd`);
    console.log(config.DIRNAME);
});


const socketServer = new Server(httpServer);
socketServer.on('connection', client =>{
    console.log('Cliente conectado!');
});


socketServer.on('connection', client => {
    
    client.emit('chatLog', messages);
    console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

    
    client.on('newMessage', message => {
        messages.push(message);
        console.log(`Mensaje recibido desde ${client.id}: ${message}`);

        socketServer.emit('messageArrived', message);
    });
});