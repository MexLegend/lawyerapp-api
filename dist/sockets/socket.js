"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
};
exports.notificacion = (cliente, io) => {
    cliente.on('notification', (payload) => {
        // console.log('Notification Received!!', payload)
        io.emit('new-notification', payload);
    });
};
