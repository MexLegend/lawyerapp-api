"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utilitiesCtrl_1 = __importDefault(require("../controllers/utilitiesCtrl"));
const authentication_1 = require("../middlewares/authentication");
class UtilitiesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/check-token/:token', utilitiesCtrl_1.default.checkToken);
        this.router.get('/rate/all/:id', utilitiesCtrl_1.default.getAllRateData);
        this.router.get('/rate/one/:id/:user', utilitiesCtrl_1.default.getRateDataFromOneUser);
        this.router.put('/rate', [authentication_1.AUTH.verifyToken], utilitiesCtrl_1.default.rateData);
        this.router.put('/rate/update', [authentication_1.AUTH.verifyToken], utilitiesCtrl_1.default.updateRatedData);
    }
}
const utilitiesRoutes = new UtilitiesRoutes();
exports.default = utilitiesRoutes.router;
