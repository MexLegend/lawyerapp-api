"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const caseMdl_1 = __importDefault(require("../models/caseMdl"));
const volumeMdl_1 = __importDefault(require("../models/volumeMdl"));
class VolumeController {
    // Insert a New Row/Document Into The Volumes Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase } = req.params;
                let volumeN = new volumeMdl_1.default({
                    case: idCase
                });
                const volume = yield volumeMdl_1.default.create(volumeN);
                res
                    .status(201)
                    .json({ volume, ok: true, message: 'Tomo creado correctamente' });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el Tomo', ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The Volumes Collection
    deleteTemp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const changeStatus = {
                    status: 'DELETED'
                };
                const caseDB = yield caseMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!caseDB) {
                    return res.status(404).json({
                        message: 'No se encontro el Caso',
                        ok: false
                    });
                }
                return res.json({
                    case: caseDB,
                    message: `Caso ${caseDB.affair} borrado`,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro el Caso',
                    ok: false
                });
            }
        });
    }
    // Get All Rows/Documents From Volumes Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase } = req.params;
                const volumes = yield volumeMdl_1.default.find({
                    case: idCase
                });
                res.status(200).json({ volumes, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caseDB = yield caseMdl_1.default.findOne({ _id: req.params.id }).populate('assigned_client');
                res.status(200).json({ ok: true, case: caseDB });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const caseDB = yield caseMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                    new: true
                });
                return res.json({
                    case: caseDB,
                    message: 'Caso actualizado correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar el Caso', ok: false });
            }
        });
    }
}
const volumeController = new VolumeController();
exports.default = volumeController;
