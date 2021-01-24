import { response } from 'express';
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { sendNotification } from 'web-push';

import Notification from '../models/notificationMdl';
import SocketUser from '../classes/socketUser';
import SocketUsersList from '../classes/socketUsersList';

export const connectedUsers = new SocketUsersList();

export const caseEvents = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(
    'send-private-case-event-notification',
    async (data: any, body: any) => {
      // Send Notification To Every Client Connectd Excluding Sender
      cliente.broadcast.emit('get-private-case-event-notification', data);
    }
  );
};

export const configClientConnected = (cliente: Socket) => {
  cliente.on('config-user', async (clientData: any) => {
    const clientName = `${clientData.user.firstName} ${clientData.user.lastName}`;

    connectedUsers.updateClientData(
      cliente,
      cliente.id,
      clientData.user._id,
      clientName,
      clientData.user.role,
      clientData.rooms
    );
  });
};

export const connectClient = (cliente: Socket) => {
  const user = new SocketUser(cliente.id);
  connectedUsers.addUser(user);
};

export const disconnect = (cliente: Socket) => {
  cliente.on('disconnect', () => {
    connectedUsers.deleteUser(cliente, cliente.id);
    console.log('Cliente desconectado');
  });
};

export const notification = (cliente: Socket, io: socketIO.Server) => {
  cliente.on('notification', async (payload: any, body: any) => {
    // let WEBPUSHPRIVATEKEY: any = process.env.WEBPUSHPRIVATEKEY;
    // let WEBPUSHPUBLICKEY: any = process.env.WEBPUSHPUBLICKEY;

    // setVapidDetails(
    //   'mailto:example@yourdomain.com',
    //   WEBPUSHPUBLICKEY,
    //   WEBPUSHPRIVATEKEY
    // );

    const pay = JSON.stringify({
      notification: {
        title: 'Pino Y Roble - Abogados',
        body: `${payload.name} actualizo su información general`,
        icon: ''
      }
    });

    let noti = {
      body: 'Gracias por subscribirte!',
      icon: '',
      title: 'Lawyerapp'
    };

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

      if (
        value.view === false &&
        value.typeU !== payload.typeU &&
        value.typeU !== undefined
      ) {
        Promise.resolve(sendNotification(payload.sub, pay))
          .then(() =>
            response.status(200).json({
              message: 'Notification sent'
            })
          )
          .catch((err) => {
            console.log(err);
            response.sendStatus(500);
          });
      }
    }
    io.emit('new-notification', payload);
  });
};

// const pay = JSON.stringify({
//   notification: {
//     title: 'Pino Y Roble - Abogados',
//     body: `${payload.name} actualizo su información general`,
//     icon: ''
//   }
// });

// let noti = {
//   body: 'Gracias por subscribirte!',
//   icon: '',
//   title: 'Lawyerapp'
// };

// const notiN = new Notification({
//   body: noti.body,
//   icon: noti.icon,
//   title: noti.title,
//   typeU: payload.typeU
// });

// await Notification.create(notiN);
// const notifi = await Notification.find();

// for (const key in notifi) {
//   const value: any = notifi[key];

//   if (
//     value.view === false &&
//     value.typeU !== payload.typeU &&
//     value.typeU !== undefined
//   ) {
//     // console.log("Notify Role: " + value.typeU + "Request Role: " + req.user.role)
//     Promise.resolve(sendNotification(payload.sub, pay))
//       .then(() =>
//         response.status(200).json({
//           message: 'Notification sent'
//         })
//       )
//       .catch((err) => {
//         console.log(err);
//         response.sendStatus(500);
//       });
//   }
// }
