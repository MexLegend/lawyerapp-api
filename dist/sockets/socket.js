"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification = exports.disconnect = exports.connectClient = exports.configClientConnected = exports.caseEvents = exports.connectedUsers = void 0;
const express_1 = require("express");
const web_push_1 = require("web-push");
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
const socketUser_1 = __importDefault(require("../classes/socketUser"));
const socketUsersList_1 = __importDefault(require("../classes/socketUsersList"));
exports.connectedUsers = new socketUsersList_1.default();
exports.caseEvents = (cliente, io) => {
    cliente.on('send-private-case-event-notification', (data, body) => __awaiter(void 0, void 0, void 0, function* () {
        // Send Notification To Every Client Connectd Excluding Sender
        cliente.broadcast.emit('get-private-case-event-notification', data);
    }));
};
exports.configClientConnected = (cliente) => {
    cliente.on('config-user', (clientData) => __awaiter(void 0, void 0, void 0, function* () {
        const clientName = `${clientData.user.firstName} ${clientData.user.lastName}`;
        exports.connectedUsers.updateClientData(cliente, cliente.id, clientData.user._id, clientName, clientData.user.role, clientData.rooms);
    }));
};
exports.connectClient = (cliente) => {
    const user = new socketUser_1.default(cliente.id);
    exports.connectedUsers.addUser(user);
};
exports.disconnect = (cliente) => {
    cliente.on('disconnect', () => {
        exports.connectedUsers.deleteUser(cliente, cliente.id);
        console.log('Cliente desconectado');
    });
};
exports.notification = (cliente, io) => {
    cliente.on('notification', (payload, body) => __awaiter(void 0, void 0, void 0, function* () {
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
        const notiN = new notificationMdl_1.default({
            body: noti.body,
            icon: noti.icon,
            title: noti.title,
            typeU: payload.typeU
        });
        yield notificationMdl_1.default.create(notiN);
        const notifi = yield notificationMdl_1.default.find();
        for (const key in notifi) {
            const value = notifi[key];
            if (value.view === false &&
                value.typeU !== payload.typeU &&
                value.typeU !== undefined) {
                Promise.resolve(web_push_1.sendNotification(payload.sub, pay))
                    .then(() => express_1.response.status(200).json({
                    message: 'Notification sent'
                }))
                    .catch((err) => {
                    console.log(err);
                    express_1.response.sendStatus(500);
                });
            }
        }
        io.emit('new-notification', payload);
    }));
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
