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
class CaseController {
    // Insert a New Row/Document Into The Cases Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // return;
                const { actor, affair, assigned_client, defendant, extKey, observations, third } = req.body;
                const databaseCasesArray = yield caseMdl_1.default.find({
                    user: req.user._id
                });
                let intKeyYear = `${new Date().getFullYear()}-`;
                let intKeyCaseNumber = Number(databaseCasesArray.length) === 0
                    ? 1
                    : Number(databaseCasesArray.length) + 1;
                let intKey = `${intKeyYear}${req.user.public_lawyer_id}-C${intKeyCaseNumber}/T1`;
                let caseN = {
                    actor,
                    affair,
                    assigned_client,
                    defendant,
                    extKey,
                    intKey: intKey,
                    observations,
                    third,
                    user: req.user._id
                };
                const cases = yield caseMdl_1.default.find();
                let volume;
                const caseDB = yield caseMdl_1.default.create(caseN);
                const volumeN = new volumeMdl_1.default({
                    case: caseDB._id
                });
                volume = yield volumeMdl_1.default.create(volumeN);
                res
                    .status(201)
                    .json({ case: caseDB, ok: true, message: 'Caso creado correctamente' });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el Caso', ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The Cases Collection
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
                    message: `Caso ${caseDB.affair} eliminado`,
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
    // Get All Rows/Documents From Cases Collection With Condition
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, perPage = 10, status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'assigned_client'
                        }
                    ],
                    sort: {
                        affair: 1
                    }
                };
                const query = {
                    status: { $ne: 'DELETED' },
                    $or: [
                        {
                            user: req.user._id
                        },
                        {
                            assigned_client: req.user._id
                        }
                    ]
                };
                const cases = yield caseMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    cases,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From Cases Collection
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cases = yield caseMdl_1.default.find({
                    assigned_client: req.params.idClient
                }).populate('assigned_client');
                res.status(200).json({ cases, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Cases Collection
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
    // Update One or More Rows/Documents From Cases Collection
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
    // Update Status From One Row/Document From Cases Collection
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const newRole = req.body.status;
                const caseDB = yield caseMdl_1.default.findOneAndUpdate({ _id: id }, { status: newRole }, {
                    new: true
                });
                return res.json({
                    case: caseDB,
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
const caseController = new CaseController();
exports.default = caseController;
