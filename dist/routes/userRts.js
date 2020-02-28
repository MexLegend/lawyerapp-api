"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userCtrl_1 = __importDefault(require("../controllers/userCtrl"));
const authentication_1 = require("../middlewares/authentication");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', userCtrl_1.default.create);
        this.router.post('/check/email', userCtrl_1.default.checkEmail);
        this.router.get('/', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], userCtrl_1.default.get);
        this.router.get('/:id', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], userCtrl_1.default.getOne);
        this.router.put('/:id', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdminSameUser], userCtrl_1.default.update);
        this.router.put('/cambiar-pass/:id', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdminSameUser], userCtrl_1.default.updatePass);
        this.router.delete('/:id', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], userCtrl_1.default.delete);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
