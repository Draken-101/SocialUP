
import express from 'express';
import { getChats } from '../controller/chat.controller';

const RoutesChat = express.Router();

RoutesChat.get('/', getChats);

export default RoutesChat;