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
const web_push_1 = require("web-push");
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
const express_1 = require("express");
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};
const getNoti = (notification) => __awaiter(void 0, void 0, void 0, function* () {
    yield notificationMdl_1.default.create(notification);
    const notifi = yield notificationMdl_1.default.find();
    return notifi;
});
exports.notificacion = (cliente, io) => {
    cliente.on('notification', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Notification Received!!', payload);
        let WEBPUSHPRIVATEKEY = process.env.WEBPUSHPRIVATEKEY;
        let WEBPUSHPUBLICKEY = process.env.WEBPUSHPUBLICKEY;
        let notifi;
        let pay;
        let typeU = (payload.typeU !== '' ? payload.typeU : 'ADMIN');
        web_push_1.setVapidDetails('mailto:example@yourdomain.com', WEBPUSHPUBLICKEY, WEBPUSHPRIVATEKEY);
        if (payload.action === 'write') {
            let noti = {
                body: 'Gracias por subscribirte!',
                icon: '',
                title: 'Lawyerapp'
            };
            pay = JSON.stringify({
                "notification": {
                    "title": "Pino Y Roble - Abogados",
                    "body": `${payload.name} actualizo su información general`,
                    "icon": ""
                }
            });
            const notiN = new notificationMdl_1.default({
                body: noti.body,
                icon: noti.icon,
                title: noti.title,
                typeU
            });
            // getNoti(notiN)
            yield notificationMdl_1.default.create(notiN);
            notifi = yield notificationMdl_1.default.find();
        }
        for (const key in notifi) {
            const value = notifi[key];
            if (value.view === false && value.typeU !== typeU && value.typeU !== undefined) {
                if (typeU === 'ADMIN') {
                    pay = JSON.stringify({
                        "notification": {
                            "title": `${value.title}`,
                            "body": `${value.body}`,
                            "icon": `${value.icon}`
                        }
                    });
                }
                Promise.resolve(web_push_1.sendNotification(payload.sub, pay))
                    .then()
                    .catch(err => {
                    console.log(err);
                    express_1.response.sendStatus(500);
                });
            }
        }
        io.emit('new-notification', payload);
    }));
};
