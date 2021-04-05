"use strict";
// const WebSocket = require('ws');
// export const connect = (cliente: WebSocket) => {
//   cliente.on('open', () => {
//     console.log('Client Connected');
//   });
// };
// export const disconnect = (cliente: WebSocket) => {
//   cliente.on('disconnect', () => {
//     console.log('Cliente desconectado');
//   });
// };
// export const caseEvents = (
//   ws: any,
//   webSocketService: any,
//   currentClient: any
// ) => {
//   ws.on('message', (data: any) => {
//     // Send Received Data To Each Client Including Sender
//     webSocketService.clients.forEach((client: any) => {
//       if (client.readyState === WebSocket.OPEN) {
//           console.log(data);
//         client.send(data, currentClient);
//       }
//     });
//     // // Send Received Data To Each Client Excluding Sender
//     // webSocketService.clients.forEach((client: any) => {
//     //   if (client !== ws && client.readyState === WebSocket.OPEN) {
//     //     client.send(data);
//     //   }
//     // });
//   });
// };
