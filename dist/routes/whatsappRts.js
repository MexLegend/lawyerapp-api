"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whatsappCtrl_1 = __importDefault(require("../controllers/whatsappCtrl"));
class WhatsappRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', whatsappCtrl_1.default.send);
    }
}
const whatsappRoutes = new WhatsappRoutes();
exports.default = whatsappRoutes.router;
