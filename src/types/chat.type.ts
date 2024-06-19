
export interface verifyChat {
  participantes: string[];
  mensajes: [
    {
      idUser: string;
      mensaje: string;
      date: string;
    }
  ]
}