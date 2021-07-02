"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginCtrl_1 = __importDefault(require("../controllers/loginCtrl"));
class LoginRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', loginCtrl_1.default.login);
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
