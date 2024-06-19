import express, { Request, Response } from 'express';
import { verifyToken } from '../middlewares/authJwt';

const RouteValidate = express.Router();

RouteValidate.post('/', verifyToken, (_req : Request, res: Response) => {
    console.log("validate");
    res.status(200).json({message: "Validate"});
} );

export default RouteValidate;