import jwt from "jsonwebtoken";
import config from "../config";
import Chat from "../models/chat";
import User from "../models/User";
import { Request, Response } from "express";
import chat from "../models/chat";

const obtenerHoraExacta = () => {
    const fecha = new Date();
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();

    if (horas < 12) {
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} AM`;
    }
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} PM`;
};

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, config.SECRET);
    } catch (error) {
        return null;
    }
};

export function validation(token: string) {
    let tokenString: string = token as string;

    const decodedToken = verifyToken(tokenString);
    if (!decodedToken) {
        return { error: true, message: "Token de autenticación no válido." };
    }
    return { error: false, message: "Token de autenticación válido." };
}

export async function getChats(req: Request, res: Response) {
    try {
        const { idUser1 } = req.params;
        const chats = await Chat.find({ participantes: idUser1 });

        if (!chats) {
            return res.status(404).json({ error: true, message: "No se encontró ningún chat para el usuario proporcionado." });
        }
        return res.status(200).json({ error: false, chats: chats });

    } catch (error) {
        console.error(error);
        return { error: true, message: "Hubo un error al obtener el chat." };
    }
}

export async function putStatusRecibido(req: Request, res: Response) {
    try {
        const { chatId } = req.body;
        await chat.findOneAndUpdate({ _id: chatId }, {})
    } catch (error) {
        console.log(error);
    }
}

export async function sendMessage(chatId: any, message: string, idUser1: string, idUser2: string, clients: any) {
    try {
        const ws = clients.get(idUser2);
        const horaActual = obtenerHoraExacta();
        const newMessage = {
            idUser: idUser1,
            mensaje: message,
            status: 0,
            date: horaActual
        };
        if (!chatId) {
            const participantes = [idUser1, idUser2];
            const newContact = await User.find({ _id: idUser2 });
            const newChat = new Chat({
                participantes,
                mensajes: [newMessage]
            })
            await User.findByIdAndUpdate(idUser1, { $push: { amigos: idUser2 } });
            await User.findByIdAndUpdate(idUser2, { $push: { amigos: idUser1 } });
            const chatGuardado = await newChat.save();
            ws?.send(JSON.stringify({
                event: "newChatReciber",
                newChat: chatGuardado,
                lastMessage: newMessage,
                newContact: newContact,
            }));
            return { error: false, event: 'newChatSender', message: "Chat creado con exito", reciber: idUser2, lastMessage: newMessage, newChat: chatGuardado }
        }
        const chat = await Chat.findOneAndUpdate(
            { _id: chatId },
            {
                $push: { mensajes: newMessage }
            }
            , { new: true }
        );
        if (!chat) {
            return { error: true, message: "Chat no encontrado" }
        }

        ws?.send(JSON.stringify({
            event: "newMessageReciver",
            chatId: chatId,
            newMessage: newMessage,
            id: idUser1,
        }))

        return { error: false, event: 'newMessageSender', chatId: chatId, id: idUser2, message: "Mensaje enviado con exito", newMessage: newMessage }
    } catch (error) {
        console.error(error);
        return { error: true, message: "Hubo un error al obtener el chat." };
    }
}