"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRoomCtrl_1 = __importDefault(require("../controllers/chatRoomCtrl"));
const authentication_1 = require("../middlewares/authentication");
class ChatRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        // Rooms
        this.router.post('/', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.createRoom);
        this.router.get('/all/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.getRooms);
        this.router.get('/one/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.getOneRoom);
        this.router.put('/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.updateRoom);
        this.router.delete('/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.deleteRoom);
        // Messages
        this.router.post('/message', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.createMessage);
        this.router.get('/message/all/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.getMessages);
        this.router.get('/message/one/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.getOneMessage);
        this.router.get('/message/last/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.getLastMessage);
        this.router.delete('/message/:id', [authentication_1.AUTH.verifyToken], chatRoomCtrl_1.default.deleteMessage);
    }
}
const chatRoutes = new ChatRoutes();
exports.default = chatRoutes.router;
