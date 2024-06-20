import { Router } from 'express';
//import { users } from '../users.js';
import { uploader } from '../uploader.js';

import usersModel from '../dao/models/users.model.js';
import config from '../config.js';

const router = Router();

//router.get('/users', async (req, res) => {
  //  const users = await usersModel.find();
    //res.status(200).send({ origin: config.SERVER , payload: users });
//});

router.get('/', async (req, res) => {
    try {
        const users = await usersModel.find();
        res.status(200).send({ origin: config.SERVER, payload: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});



router.post('/', uploader.single('thumbnail'), (req, res) => {
    const socketServer = req.app.get('socketServer');

    console.log(req.file);
    console.log(req.body);
    users.push(req.body);
    res.status(200).send({ origin: 'server1', payload: req.body });

    socketServer.emit('newUser', 'Se cargó nuevo usuario');
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const nid = +id; 
    if (nid <= 0 || isNaN(nid)) { 
        res.status(400).send({ origin: 'server1', payload: [], error: 'Se requiere id numérico mayor a 0' });
    } else {
        const { email = '', password = '' } = req.body;
        
        res.status(200).send({ origin: 'server1', payload: `Quiere modificar el id ${id} con el contenido del body`, body: { email, password } });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const nid = +id; 

    if (nid <= 0 || isNaN(nid)) { 
        res.status(400).send({ origin: 'server1', payload: [], error: 'Se requiere id numérico mayor a 0' });
    } else {        
        res.status(200).send({ origin: 'server1', payload: `Quiere borrar el id ${id}` });
    }
});

export default router;
