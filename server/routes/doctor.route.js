import express from 'express';
import { isuserauth } from '../middlewares/isUserAuth.js';
import { getClients,getClientMessage,SendMessage } from '../controller/Doctor.controller.js';

const router = express.Router();

router.get('/getClients', isuserauth, getClients)
router.get('/getClientMessage/:clId', isuserauth, getClientMessage)
router.patch('/SendMessage/:clId', isuserauth, SendMessage)


export default router;