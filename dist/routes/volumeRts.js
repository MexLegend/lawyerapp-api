"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const volumeCtrl_1 = __importDefault(require("../controllers/volumeCtrl"));
const authentication_1 = require("../middlewares/authentication");
class VolumeRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/:idCase', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], volumeCtrl_1.default.create);
        this.router.get('/all/:idCase', [authentication_1.AUTH.verifyToken], volumeCtrl_1.default.get);
        this.router.get('/:id', volumeCtrl_1.default.getOne);
        this.router.put('/:id', volumeCtrl_1.default.update);
        this.router.delete('/temp/:id', volumeCtrl_1.default.deleteTemp);
    }
}
const volumeRoutes = new VolumeRoutes();
exports.default = volumeRoutes.router;
