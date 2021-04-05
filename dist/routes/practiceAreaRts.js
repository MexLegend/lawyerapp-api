"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const practiceAreaCtrl_1 = __importDefault(require("../controllers/practiceAreaCtrl"));
class PracticeAreaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdminAssociated], practiceAreaCtrl_1.default.create);
        this.router.get('/', practiceAreaCtrl_1.default.get);
        this.router.get('/:idPracticeArea', practiceAreaCtrl_1.default.getOne);
        this.router.get('/specialized-lawyers/:idPracticeArea', practiceAreaCtrl_1.default.getSpecializedLawyers);
        this.router.put('/:idPracticeArea', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.update);
        this.router.put('/specialized-lawyer/', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.updateSpecializedLawyer);
        this.router.put('/specialized-lawyer/:idPracticeArea', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.deleteSpecializedLawyer);
        this.router.put('/updateStatus/:idPracticeArea', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.updateState);
        this.router.delete('/completly/:idPracticeArea', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.deleteCompletly);
        this.router.delete('/temporary/:idPracticeArea', [authentication_1.AUTH.verifyToken, authentication_1.AUTH.verifyAdmin], practiceAreaCtrl_1.default.deleteTemporary);
    }
}
const practiceAreaRoutes = new PracticeAreaRoutes();
exports.default = practiceAreaRoutes.router;
