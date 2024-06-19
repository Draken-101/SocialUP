
import express from 'express';
import { verifyToken } from '../middlewares/authJwt';
import { postEstado } from '../controller/estado.Controller';

const RoutesEstados = express.Router();

RoutesEstados.post('/', verifyToken, postEstado);

export default RoutesEstados;