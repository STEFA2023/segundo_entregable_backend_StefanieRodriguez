import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import session from 'express-session'; 
import { Server } from 'socket.io';
import FileStore from 'session-file-store';
import passport from 'passport';
import config from './config.js';
import initSocket from './sockets.js';
import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js';
import { cartsRouter } from './cart.js'; 
import cookieRouter from './routes/cookies.routes.js';
import sessionRouter from './routes/sessions.routes.js';




//import sessions from 'express-session';
import Message from './dao/models/message.model.js';
import TestRouter from './routes/test.routes.js';
import http from 'http';


const app = express();

let messages = [];

const expressInstance = app.listen(config.PORT, async() => {
    await mongoose.connect(config.MONGODB_URI);

    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);


    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser(config. SECRET));

    const fileStorage = FileStore(session);
    app.use(session({
        store: new fileStorage({ path: './sessions', ttl: 100, retries: 0 }),
        // store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: false,
        saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());


app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('views', `${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');


app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookieRouter);
app.use('/api/sessions', sessionRouter);

app.use('/api/test', new TestRouter().getRouter());


const server = http.createServer(app);
const io = new Server(server);





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


/*const httpServer = app.listen('/api/carts', cartsRouter);(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Servidor escuchando en el puerto ${config.PORT} enlazada a bbdd`);
    console.log(config.DIRNAME);
}); */


//const socketServer = new Server(httpServer);
socketServer.on('connection', client =>{
    console.log('Cliente conectado!');

    Message.find().then(messages => {
        client.emit('chatLog', messages);
    });

    client.on('newMessage', async message => {
        const newMessage = new Message(message);
        await newMessage.save();  // Guardar el mensaje en la base de datos
        console.log(`Mensaje recibido desde ${client.id}: ${message.message}`);
        socketServer.emit('messageArrived', message);
    });
});


socketServer.on('connection', client => {
    
    client.emit('chatLog', messages);
    console.log(`Cliente conectado, id ${client.id} desde ${client.handshake.address}`);

    
    client.on('newMessage', message => {
        messages.push(message);
        console.log(`Mensaje recibido desde ${client.id}: ${message}`);

        socketServer.emit('messageArrived', message);
    });


    console.log(`App activa en puerto ${config.PORT} conectada a bbdd ${config.SERVER}`);
})
});