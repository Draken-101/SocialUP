import { Schema, model, Document } from 'mongoose';
import { verifyChat } from '../types/chat.type';

interface chatDocument extends verifyChat, Document {}

const chatSchema = new Schema<chatDocument>({
  participantes: [{ type: String, required: true }],
  mensajes: [
    {
      idUser: { type: String, required: true },
      mensaje: { type: String, required: true },
      status: { type: Number, require: true},
      date: { type: String, required: true}
    }
  ]
});

export default model<chatDocument>('Chat', chatSchema);
