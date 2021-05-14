"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utilitiesCtrl_1 = __importDefault(require("../controllers/utilitiesCtrl"));
class UtilitiesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/check-token/:token', utilitiesCtrl_1.default.checkToken);
    }
}
const utilitiesRoutes = new UtilitiesRoutes();
exports.default = utilitiesRoutes.router;
