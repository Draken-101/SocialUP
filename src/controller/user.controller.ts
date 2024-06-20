import { Request, Response } from 'express';
import User from '../models/User';
import jwt from "jsonwebtoken";
import config from "../config";
import Profile from "../models/profile";
import { Clients } from '../globals/clients';


export const signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: true, message: "Usuario no encontrado." });
        }

        const matchPassword = await user.comparePassword(password);
        if (!matchPassword) {
            return res.status(403).json({ error: true, message: "Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user.password }, config.SECRET, { expiresIn: 86400 });
        return res.status(200).json({ error: false, token: token, amigos: user.amigos, idUser1: user._id, profilePictureUrl: user.profilePictureUrl, username: user.username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un error.", error });
    }
};

export const signUp = async (req: Request, res: Response) => {
    console.log(req.body.username);
    const { username, password } = req.body;
    try {
        const allProfiles = await Profile.find();
        const profile = allProfiles[Math.floor(Math.random() * (allProfiles.length + 1))].url;
        const newUser = new User({
            username,
            password: await User.encryptPassword(password),
            profilePictureUrl: profile
        });

        const savedUser: any = await newUser.save();

        Clients?.map((client: any) => {
            client.res.write(`event:newUser\n`);
            client.res.write(`data:${JSON.stringify(savedUser)}\n\n`);
        });
        return res.status(200).json({ sucess: true, user: { ...savedUser._doc, password: '' } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el usuario", error });
    }
};

export async function putProfile(req: Request, res: Response) {
    try {
        const { idUser1, amigos, url, username } = req.body;
        const updateUser = await User.findByIdAndUpdate(idUser1, { $set: { profilePictureUrl: url, username: username } }, { new: true }).select('-password -__v');

        amigos.map(async (amigo: any) => {
            const resAmigo = Clients.find((client: any) => client.idUser === amigo);
            if (resAmigo !== undefined) {
                resAmigo.res.write(`event:updateContact\n`);
                resAmigo.res.write(`data:${JSON.stringify( { profilePictureUrl: updateUser?.profilePictureUrl, username: updateUser?.username, idUser: updateUser?._id } )}\n\n`);
            }
        })
        console.log("id: | ", req.body.idUser1, " | Cliente atendido | ");
        return res.json(updateUser);
    } catch (error) {
        console.error('Error al verificar cambios en la foto de perfil:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
    }
};
