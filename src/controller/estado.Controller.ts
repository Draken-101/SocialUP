import { Request, Response } from 'express';
import estado from '../models/estado';
import { Clients } from '../globals/clients';

export const postEstado = async (req: Request, res: Response) => {
    try {
        const { idUser1, amigos, multimedia, mensaje } = req.body;
        
        const newEstado = new estado({
            idUser: idUser1,
            multimedia: multimedia || { tipo: "", url: "" },
            mensaje: mensaje,
            expiracion: new Date()
        });

        const savedEstado: any = await newEstado.save();
        console.log(savedEstado);
        amigos.map((amigo: any) => {
            const resAmigo = Clients.find((client: any) => client.idUser === amigo);
            if (resAmigo !== undefined) {
                resAmigo.res.write(`event:newEstado\n`);
                resAmigo.res.write(`data:${JSON.stringify(savedEstado)}\n\n`);
            }
        })
        console.log("id: | ", req.body.idUser1, " | Cliente atendido | Estados");
        return res.status(200).json({ message: "Estado guardado correctamente", estado: savedEstado });
    } catch (error) {
        console.error('Error al guardar el estado:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};