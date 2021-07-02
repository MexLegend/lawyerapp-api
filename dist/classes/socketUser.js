"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketUser {
    constructor(socketId) {
        this.publicId = 'Sin-identificador';
        this.socketId = socketId;
        this.client = {};
        this.name = 'Sin-nombre';
        this.userRooms = [];
    }
}
exports.default = SocketUser;
