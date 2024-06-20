
import express from 'express';
import { getChats } from '../controller/chat.controller';

const RoutesChat = express.Router();

RoutesChat.get('/:idUser1', getChats);

export default RoutesChat;