import express from 'express';
import { putProfile, signIn, signUp } from '../controller/user.controller';
import { verifyToken } from '../middlewares/authJwt';

const RoutesUsers = express.Router();


RoutesUsers.post('/singin', signIn);

RoutesUsers.post('/singup', signUp);

RoutesUsers.put('/updateProfile', verifyToken , putProfile);

export default RoutesUsers;