"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trackingCtrl_1 = __importDefault(require("../controllers/trackingCtrl"));
const authentication_1 = require("../middlewares/authentication");
class TrackingRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:id', trackingCtrl_1.default.get);
        this.router.post('/:id', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], trackingCtrl_1.default.create);
        this.router.put('/:id', trackingCtrl_1.default.update);
    }
}
const trackingRoutes = new TrackingRoutes();
exports.default = trackingRoutes.router;
