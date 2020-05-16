"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileCtrl_1 = __importDefault(require("../controllers/fileCtrl"));
const authentication_1 = require("../middlewares/authentication");
class FileRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], fileCtrl_1.default.create);
        this.router.get('/', [authentication_1.AUTH.verifyToken], fileCtrl_1.default.get);
        this.router.get('/all/:idClient', [authentication_1.AUTH.verifyToken], fileCtrl_1.default.getAll);
        this.router.get('/:id', fileCtrl_1.default.getOne);
        this.router.put('/:id', fileCtrl_1.default.update);
        this.router.put('/upload/file', fileCtrl_1.default.upload);
        this.router.delete('/:id', fileCtrl_1.default.delete);
    }
}
const fileRoutes = new FileRoutes();
exports.default = fileRoutes.router;
