"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evidenceCtrl_1 = __importDefault(require("../controllers/evidenceCtrl"));
const authentication_1 = require("../middlewares/authentication");
class EvidenceRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/:idCase', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.create);
        this.router.get('/all/:idCase', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.get);
        this.router.get('/:idCase', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.getOne);
        this.router.put('/:idCase/:idEvidence', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.update);
        this.router.put('/status/:idCase/:idEvidence', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.changeTemp);
        this.router.delete('/temp/:idCase/:idEvidence', [authentication_1.AUTH.verifyToken], evidenceCtrl_1.default.changeTemp);
    }
}
const evidenceRoutes = new EvidenceRoutes();
exports.default = evidenceRoutes.router;
