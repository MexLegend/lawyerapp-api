"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const contactCtrl_1 = __importDefault(require("../controllers/contactCtrl"));
class ContactRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken], contactCtrl_1.default.create);
        this.router.get('/:id', [authentication_1.AUTH.verifyToken], contactCtrl_1.default.getAll);
        this.router.get('/one/:id', [authentication_1.AUTH.verifyToken], contactCtrl_1.default.getOne);
        this.router.put('/:id', [authentication_1.AUTH.verifyToken], contactCtrl_1.default.update);
        this.router.delete('/:id', [authentication_1.AUTH.verifyToken], contactCtrl_1.default.delete);
    }
}
const contactRoutes = new ContactRoutes();
exports.default = contactRoutes.router;
