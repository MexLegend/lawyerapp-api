"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationCtrl_1 = __importDefault(require("../controllers/notificationCtrl"));
const authentication_1 = require("../middlewares/authentication");
class NotificationsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken], notificationCtrl_1.default.create);
        this.router.get('/', notificationCtrl_1.default.get);
        this.router.get('/:id', notificationCtrl_1.default.getOne);
        this.router.put('/:id', notificationCtrl_1.default.update);
        this.router.delete('/:id', notificationCtrl_1.default.delete);
    }
}
const notificationsRoutes = new NotificationsRoutes();
exports.default = notificationsRoutes.router;
