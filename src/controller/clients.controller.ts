import { Request, Response } from "express";
import { Clients, setClients } from "../globals/clients";
import User from "../models/User";
import chat from "../models/chat";
import estado from "../models/estado";
import { validation } from "./chat.controller";

export async function getData(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { idUser1, token } = req.params;

    const validateGetChats = validation(token);
    if (validateGetChats.error) {
        res.write(`event:unautorized\n`);
        res.write(`data:${validateGetChats.message}\n\n`);
        return;
    }

    const userSaved = Clients?.find((client: any) => client.idUser == idUser1);
    console.log("Cliente esperando | id: ", idUser1, " |");

    if (userSaved) {
        setClients(Clients.filter((client: any) => client.idUser !== idUser1));
    }

    Clients.push({
        idUser: idUser1,
        res: res
    })

    const amigos: string[] = await User.find({ amigos: idUser1 });

    res.write(`event:userContacts\n`);
    res.write(`data:${await getUserContacts(idUser1)}\n\n`);

    res.write(`event:allContacts\n`);
    res.write(`data:${await getAllContacts(idUser1, amigos)}\n\n`);

}

async function getAllContacts(idUser1: string, amigos: string[]) {
    const identificadores = [...amigos, idUser1];
    const contacts = await User.find({ _id: { $nin: identificadores } }).select('-password -amigos -__v');
    return JSON.stringify(contacts);
}

async function getUserContacts(idUser1: string) {
    let users = await User.find({ amigos: idUser1 });
    users = await Promise.all(users.map(async (user: any) => {
        const resultado = await chat.aggregate([
            { $match: { participantes: { $all: [idUser1, user._id.toString()] } } },
            { $project: { ultimoMensaje: { $arrayElemAt: ['$mensajes', -1] } } }
        ]);
        let newUser: any = user;
        let estados = await estado.find({ idUser: user._doc._id.toString() })
        if (estados.length > 0) {
            return newUser = { ...newUser._doc, estados: estados, noReads: 0, lastMessage: resultado.length > 0 ? resultado[0].ultimoMensaje : null };
        }
        return { ...newUser._doc, noReads: 0, lastMessage: resultado.length > 0 ? resultado[0].ultimoMensaje : null };
    }));
    return JSON.stringify(users);
}