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
exports.notification = exports.existUser = exports.disconnect = void 0;
const express_1 = require("express");
const web_push_1 = require("web-push");
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
exports.disconnect = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};
exports.existUser = (cliente, io) => {
    cliente.on('exist-user', (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('exist!!', payload);
    }));
};
exports.notification = (cliente, io) => {
    cliente.on('notification', (payload, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Notification Received!!', payload);
        let WEBPUSHPRIVATEKEY = process.env.WEBPUSHPRIVATEKEY;
        let WEBPUSHPUBLICKEY = process.env.WEBPUSHPUBLICKEY;
        console.log(process.env.WEBPUSHPRIVATEKEY);
        web_push_1.setVapidDetails('mailto:example@yourdomain.com', WEBPUSHPUBLICKEY, WEBPUSHPRIVATEKEY);
        // console.log('New client ogggggggggggg', cliente)
        let pay = JSON.stringify({
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
                // console.log("Notify Role: " + value.typeU + "Request Role: " + req.user.role)
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
