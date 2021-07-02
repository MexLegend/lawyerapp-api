"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteCtrl_1 = __importDefault(require("../controllers/noteCtrl"));
const authentication_1 = require("../middlewares/authentication");
class NoteRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/:idCase', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.create);
        this.router.get('/all/:id', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.get);
        this.router.get('/:id', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.getOne);
        this.router.put('/:idCase/:idNote', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.update);
        this.router.put('/status/:idCase/:idNote', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.changeTemp);
        this.router.delete('/temp/:idCase/:idNote', [authentication_1.AUTH.verifyToken], noteCtrl_1.default.changeTemp);
    }
}
const noteRoutes = new NoteRoutes();
exports.default = noteRoutes.router;
