import express from 'express';
import { getData } from '../controller/clients.controller';

const RoutesClients = express.Router();

RoutesClients.get('/:idUser1/:token', getData);

export default RoutesClients;