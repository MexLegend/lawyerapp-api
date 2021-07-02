"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseCtrl_1 = __importDefault(require("../controllers/caseCtrl"));
const authentication_1 = require("../middlewares/authentication");
class CaseRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken], caseCtrl_1.default.create);
        this.router.get('/', [authentication_1.AUTH.verifyToken], caseCtrl_1.default.get);
        this.router.get('/all/:idClient', [authentication_1.AUTH.verifyToken], caseCtrl_1.default.getAll);
        this.router.get('/:id', caseCtrl_1.default.getOne);
        this.router.put('/:id', caseCtrl_1.default.update);
        this.router.put('/updateStatus/:id', caseCtrl_1.default.updateStatus);
        this.router.delete('/temp/:id', caseCtrl_1.default.deleteTemp);
    }
}
const caseRoutes = new CaseRoutes();
exports.default = caseRoutes.router;
