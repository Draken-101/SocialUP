import { Schema, model, Document } from 'mongoose';
import { EstadoValidate } from '../types/estado.type';

interface EstadoDocument extends EstadoValidate, Document {
  idUser: string;
  multimedia: {
    tipo: string;
    url: string;
  };
  mensaje: string;
  vistas: string[];
  expiracion: Date,
}

const EstadoSchema = new Schema<EstadoDocument>({
  idUser: { type: String, require: true },
  multimedia: {
    tipo: { type: String },
    url: { type: String }
  },
  mensaje: { type: String },
  vistas: [{ type: String }],
  expiracion: { type: Date, default: Date.now, expires: 120 },
});

export default model<EstadoDocument>('Estado', EstadoSchema);

