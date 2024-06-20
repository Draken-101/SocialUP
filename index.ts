import './dataBase';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import express from 'express';
import RouteProfile from './src/routes/profile.routes';
import RouteValidate from './src/routes/validate.routes'
import { sendMessage, validation } from './src/controller/chat.controller';
import cors from 'cors';
import RoutesUsers from './src/routes/user.routes';
import RoutesEstados from './src/routes/estado.routes';
import RoutesClients from './src/routes/clients.routes';
import RoutesChat from './src/routes/chat.routes';



const app = express();
app.use(cors({
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE'
  }))

app.use(express.json());

app.use('/profile', RouteProfile)

app.use(`/validate`, RouteValidate);
  
app.use(`/users`, RoutesUsers); 
 
app.use(`/clients`, RoutesClients);

app.use(`/chat`, RoutesChat); 

app.use(`/estados`, RoutesEstados); 

const server = createServer(app);

const wss = new WebSocketServer({ server });

const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
        message: '🚀 ¡Prepárate para una experiencia increíble! La cuenta regresiva ha comenzado. ⏳💥'
    }))
    ws.on('message', async (data) => {
        const dataJson = JSON.parse(data.toString());
        const userId: any = dataJson.idUser1;
            console.log("Cliente | ", userId, " |");
        if (!clients.get(userId)) {
            console.log("Cliente | ", !clients.get(userId), " |");
            clients.delete(userId);
        }
        clients.set(userId, ws);
        switch (dataJson.event) {
            case 'sendMessage':
                try {

                    const validateSendMessage = validation(dataJson.token);
                    if (validateSendMessage.error) {
                        ws.send(JSON.stringify(validateSendMessage.message));
                        return;
                    }
                    const sendMessageOK = await sendMessage(dataJson.chatId, dataJson.message, dataJson.idUser1, dataJson.idUser2, clients);
                    if (sendMessageOK.error) {
                        ws.send(JSON.stringify(sendMessageOK.message))
                        return;
                    }
                    ws.send(JSON.stringify(sendMessageOK))
                } catch (error) {
                    console.log(error); 
                }
                break;
            default:
                break;
        }
    })

    ws.on('close', () => {
        const userId = [...clients.entries()].find(([_key, client]) => client === ws)?.[0];
        if (userId) {
            clients.delete(userId);
            console.log(`Cliente ${userId} desconectado`);
        }
    });
});

server.listen(3000, () => {
    console.log(`¡Todo en marcha y corriendo en el puerto 3000! 🚀🎉`)
});

