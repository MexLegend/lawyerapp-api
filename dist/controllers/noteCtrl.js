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
const noteMdl_1 = __importDefault(require("../models/noteMdl"));
class NoteController {
    // Update Status From One Row/Document From Notes Collection
    changeTemp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase, idNote } = req.params;
                let { status, deleted } = req.body;
                const noteDB = yield noteMdl_1.default.findOne({ case: idCase });
                let newN = [];
                status = status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
                noteDB.notes.forEach((note) => {
                    if (note._id.toString() === idNote.toString()) {
                        note.status = req.body.status ? status : deleted;
                    }
                    newN.push(note);
                });
                const note = yield noteMdl_1.default.findOneAndUpdate({ case: idCase }, {
                    $set: {
                        notes: newN
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
                        message: 'Nota borrada',
                        note,
                        ok: true
                    });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro la Nota',
                    ok: false
                });
            }
        });
    }
    // Insert a New Row/Document Into The Notes Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase } = req.params;
                const noteDB = yield noteMdl_1.default.find({ case: idCase });
                let noteN;
                let note;
                console.log(noteDB);
                // return;
                note = {
                    affair: req.body.noteAffair,
                    message: req.body.noteMessage,
                    status: req.body.noteStatus
                };
                if (noteDB.length === 0) {
                    noteN = new noteMdl_1.default({
                        case: idCase,
                        notes: [note]
                    });
                    note = yield noteMdl_1.default.create(noteN);
                }
                else if (noteDB && noteDB.length >= 1) {
                    note = yield noteMdl_1.default.findOneAndUpdate({ case: idCase }, {
                        $push: {
                            notes: [note]
                        }
                    }, {
                        new: true
                    });
                }
                return res.json({
                    note,
                    message: 'Nota creada correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear la Nota', ok: false });
            }
        });
    }
    // Get All Rows/Documents From Notes Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = '', page = 1, perPage = 10, orderField, orderType } = req.query;
                const { id } = req.params;
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
                let filtroE = new RegExp(filter, 'i');
                const query = {
                    case: id,
                    status: { $ne: 'DELETED' }
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const notes = yield noteMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    notes,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Notes Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const note = yield noteMdl_1.default.findOne({ _id: id });
                if (!note) {
                    return res.json({
                        message: 'La Nota no existe',
                        ok: false
                    });
                }
                return res.status(200).json({
                    note,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From Notes Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase, idNote } = req.params;
                const evidenceDB = yield noteMdl_1.default.findOne({ case: idCase });
                let newN = [];
                evidenceDB.notes.forEach((n) => {
                    if (n._id.toString() === idNote.toString()) {
                        n = req.body;
                    }
                    newN.push(n);
                });
                const note = yield noteMdl_1.default.findOneAndUpdate({ case: idCase }, {
                    $set: {
                        notes: newN
                    }
                }, {
                    new: true
                });
                return res.json({
                    note,
                    message: 'Nota actualizada correctamente',
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
const noteController = new NoteController();
exports.default = noteController;
