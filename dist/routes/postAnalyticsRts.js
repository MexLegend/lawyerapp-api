"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postAnalyticsCtrl_1 = __importDefault(require("../controllers/postAnalyticsCtrl"));
const authentication_1 = require("../middlewares/authentication");
class PostAnalyticsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', postAnalyticsCtrl_1.default.get);
        this.router.get('/:idArray', postAnalyticsCtrl_1.default.getOne);
        this.router.put('/postComment/:idPost', [authentication_1.AUTH.verifyToken], postAnalyticsCtrl_1.default.postComment);
        this.router.put('/update/:idPost', [authentication_1.AUTH.verifyToken], postAnalyticsCtrl_1.default.update);
    }
}
const postAnalyticsRoutes = new PostAnalyticsRoutes();
exports.default = postAnalyticsRoutes.router;
