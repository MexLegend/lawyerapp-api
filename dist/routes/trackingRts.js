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
        this.router.post('/:idVolume', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], trackingCtrl_1.default.create);
        this.router.get('/all/:idVolume', trackingCtrl_1.default.get);
        this.router.get('/client/:idCase/:idClient', [authentication_1.AUTH.verifyToken], trackingCtrl_1.default.getByClient);
        this.router.get('/lawyer/all', [authentication_1.AUTH.verifyToken], trackingCtrl_1.default.getByLowyer);
        this.router.get('/:id', trackingCtrl_1.default.getOne);
        this.router.put('/:idTracking', trackingCtrl_1.default.update);
        this.router.put('/status/:idTrack', trackingCtrl_1.default.changeTemp);
        this.router.delete('/:id', trackingCtrl_1.default.delete);
        this.router.delete('/:id/doc/:idDoc', trackingCtrl_1.default.deleteDoc);
    }
}
const trackingRoutes = new TrackingRoutes();
exports.default = trackingRoutes.router;
