import { response } from 'express';
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { setVapidDetails, sendNotification } from 'web-push';

import { AUTH } from '../middlewares/authentication';
import Notification from '../models/notificationMdl';


export const disconnect = (cliente: Socket) => {
         cliente.on('disconnect', () => {
           console.log('Cliente desconectado');
         });
       };

export const existUser = (cliente: Socket, io: socketIO.Server) => {
  cliente.on('exist-user', async (payload: any) => {
    console.log('exist!!', payload)
  })
}

export const notification = (cliente: Socket, io: socketIO.Server) => {
  cliente.on('notification', async (payload: any, body: any) => {
    console.log('Notification Received!!', payload)

    let WEBPUSHPRIVATEKEY: any = process.env.WEBPUSHPRIVATEKEY;
    let WEBPUSHPUBLICKEY: any = process.env.WEBPUSHPUBLICKEY;

    console.log(process.env.WEBPUSHPRIVATEKEY)
    setVapidDetails(
      'mailto:example@yourdomain.com',
      WEBPUSHPUBLICKEY,
      WEBPUSHPRIVATEKEY
    );
    // console.log('New client ogggggggggggg', cliente)

    let pay = JSON.stringify({
      "notification": {
        "title": "Pino Y Roble - Abogados",
        "body": `${payload.name} actualizo su información general`,
        "icon": ""
      }

    });

    let noti = {
      body: 'Gracias por subscribirte!',
      icon: '',
      title: 'Lawyerapp'
    }

    const notiN = new Notification({
      body: noti.body,
      icon: noti.icon,
      title: noti.title,
      typeU: payload.typeU
    });

    await Notification.create(notiN);
    const notifi = await Notification.find();

    for (const key in notifi) {
      const value: any = notifi[key];

      if (value.view === false && value.typeU !== payload.typeU && value.typeU !== undefined) {
        // console.log("Notify Role: " + value.typeU + "Request Role: " + req.user.role)
        Promise.resolve(sendNotification(payload.sub, pay))
          .then(() =>
            response.status(200).json({
              message: 'Notification sent'
            })
          )
          .catch(err => {
            console.log(err);
            response.sendStatus(500);
          })
      }
    }
    io.emit('new-notification', payload);
  });
};
