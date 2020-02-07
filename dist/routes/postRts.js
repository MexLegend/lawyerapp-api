"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postCtrl_1 = __importDefault(require("../controllers/postCtrl"));
const authentication_1 = require("../middlewares/authentication");
class PostRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], postCtrl_1.default.create);
        this.router.get('/', postCtrl_1.default.get);
        this.router.get('/:id', postCtrl_1.default.getOne);
        this.router.put('/:id', postCtrl_1.default.update);
        this.router.delete('/:id', postCtrl_1.default.delete);
    }
}
const postRoutes = new PostRoutes();
exports.default = postRoutes.router;
