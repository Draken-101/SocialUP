
import express from 'express';
import { verifyToken } from '../middlewares/authJwt';
import { getProfiles, postProfile } from '../controller/profile.controller';

const ProfileRouter = express.Router();

ProfileRouter.get('/', getProfiles);

ProfileRouter.post('/', verifyToken, postProfile);

export default ProfileRouter;