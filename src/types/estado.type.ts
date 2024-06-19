
export interface EstadoValidate {
  idUser: string;
  multimedia: {
    tipo: string,
    url: string
  };
  mensaje: string;
  expiracion: Date;
  vistas: string[];
}