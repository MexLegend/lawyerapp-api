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
const evidenceMdl_1 = __importDefault(require("../models/evidenceMdl"));
const documents_1 = __importDefault(require("../helpers/documents"));
class EvidenceController {
    // Update Status From One Row/Document From Evidences Collection
    changeTemp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // return;
                const { idCase, idEvidence } = req.params;
                let { status, deleted } = req.body;
                const evidenceDB = yield evidenceMdl_1.default.findOne({ case: idCase });
                let newEvidences = [];
                status = status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
                evidenceDB.evidences.forEach((evidence) => {
                    if (evidence._id.toString() === idEvidence.toString()) {
                        evidence.status = req.body.status ? status : deleted;
                    }
                    newEvidences.push(evidence);
                });
                const note = yield evidenceMdl_1.default.findOneAndUpdate({ case: idCase }, {
                    $set: {
                        evidences: newEvidences
                    }
                }, {
                    new: true
                });
                if (!note) {
                    return res.status(404).json({
                        message: 'No se encontro la Nota',
                        ok: false
                    });
                }
                return req.body.status
                    ? res.json({
                        message: `${status === 'PUBLIC' ? 'Pública' : 'Privada'}`,
                        note,
                        ok: true
                    })
                    : res.json({
                        deleted: true,
                        message: 'Evidencia borrada',
                        note,
                        ok: true
                    });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro la Evidencia',
                    ok: false
                });
            }
        });
    }
    // Insert a New Row/Document Into The Evidences Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase } = req.params;
                const evidenceDB = yield evidenceMdl_1.default.find({ case: idCase });
                let evidences = [];
                let newEvidence;
                let evidence;
                if (req.body) {
                    req.body.map((evidence) => {
                        evidences.push({
                            name: evidence.name,
                            path: evidence.url,
                            public_id: evidence.public_id,
                            size: evidence.size
                        });
                    });
                    if (evidenceDB.length === 0) {
                        newEvidence = {
                            case: idCase,
                            evidences: evidences
                        };
                        evidence = yield evidenceMdl_1.default.create(newEvidence);
                    }
                    else if (evidenceDB[0].evidences.length >= 1 ||
                        evidenceDB[0].evidences.length === 0) {
                        evidence = yield evidenceMdl_1.default.findOneAndUpdate({ case: idCase }, {
                            $push: {
                                evidences
                            }
                        }, {
                            new: true
                        });
                    }
                    // documents.docs = [];
                }
                return res.json({
                    evidence,
                    message: 'Evidencia creada correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear la Evidencia', ok: false });
            }
        });
    }
    // Delete Permanently a Row/Document From The Evidences Collection
    deleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idEvidence, idCase } = req.params;
                const evidence = yield evidenceMdl_1.default.findOne({
                    _id: idEvidence
                });
                let newEvidences = [];
                newEvidences = evidence.evidences.filter((evidence) => {
                    return evidence._id.toString() !== idCase.toString();
                });
                const evidenceU = yield evidenceMdl_1.default.findOneAndUpdate({
                    _id: idEvidence
                }, {
                    $set: { evidences: newEvidences }
                }, {
                    new: true
                });
                res.status(200).json({ evidence: evidenceU, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From Evidences Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, perPage = 10 } = req.query;
                const { idCase } = req.params;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'case'
                        }
                    ],
                    sort: {
                        date: 1
                    }
                };
                const query = {
                    case: idCase,
                    status: { $ne: 'DELETED' }
                };
                const evidences = yield evidenceMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    evidences,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Evidences Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase } = req.params;
                const evidence = yield evidenceMdl_1.default.findOne({ case: idCase });
                return res.status(200).json({
                    evidence,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From Evidences Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idEvidence, idFile } = req.params;
                const { file } = req.body;
                const evidenceBD = yield evidenceMdl_1.default.findOne({ _id: idEvidence });
                let newEvidences = [];
                let evidence;
                if (evidenceBD && req.files && req.files.length >= 1) {
                    documents_1.default.getDocs().forEach((evidence) => {
                        let filePath = `${req.hostname}${process.env.NODE_ENV === 'dev' ? ':3000' : ''}/ftp/uploads/${evidence}`;
                        newEvidences.push({
                            evidence: filePath
                        });
                    });
                    if (newEvidences.length >= 1) {
                        evidence = yield evidenceMdl_1.default.findOneAndUpdate({ _id: idEvidence }, {
                            $push: {
                                evidences: newEvidences
                            }
                        }, {
                            new: true
                        });
                    }
                    documents_1.default.docs = [];
                }
                return res.json({
                    evidence,
                    message: 'Archivos agregados correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
            }
        });
    }
}
const evidenceController = new EvidenceController();
exports.default = evidenceController;
