import { Response } from 'express';

interface ClientResponse {
    idUser: String;
    res: Response;
}

// Array para almacenar las respuestas de los clientes
export let Clients: ClientResponse[] = [];

export function setClients(newClients: ClientResponse[]) {
    Clients = newClients;
}
