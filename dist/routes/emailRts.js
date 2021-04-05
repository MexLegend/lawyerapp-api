"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailCtrl_1 = __importDefault(require("../controllers/emailCtrl"));
class EmailRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', emailCtrl_1.default.send);
    }
}
const emailRoutes = new EmailRoutes();
exports.default = emailRoutes.router;
