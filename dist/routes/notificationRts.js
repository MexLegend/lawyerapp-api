"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationCtrl_1 = __importDefault(require("../controllers/notificationCtrl"));
const authentication_1 = require("../middlewares/authentication");
class PostRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/write', [authentication_1.AUTH.verifyToken], notificationCtrl_1.default.create);
        this.router.post('/listen', [authentication_1.AUTH.verifyToken], notificationCtrl_1.default.send);
        this.router.get('/', notificationCtrl_1.default.get);
        this.router.get('/:id', notificationCtrl_1.default.getOne);
        this.router.put('/:id', notificationCtrl_1.default.update);
        this.router.delete('/:id', notificationCtrl_1.default.delete);
    }
}
const postRoutes = new PostRoutes();
exports.default = postRoutes.router;
