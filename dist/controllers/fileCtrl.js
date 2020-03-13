"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileMdl_1 = __importDefault(require("../models/fileMdl"));
class FileController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body);
                // return;
                const fileN = new fileMdl_1.default({
                    actor: body.actor,
                    affair: body.affair,
                    assigned_client: body.assigned_client,
                    defendant: body.defendant,
                    description: body.description,
                    intKeys: [{
                            intKey: body.intKeys.intKey,
                            num: body.intKeys.num
                        }],
                    third: body.third,
                    extKey: body.extKey,
                    user: req.user._id,
                    volumes: [{
                            num: body.intKeys.num,
                            volume: 'T1/04/03/2020'
                        }]
                });
                const file = yield fileMdl_1.default.create(fileN);
                res.status(201).json({ file, ok: true, message: 'Expediente creado correctamente' });
            }
            catch (err) {
                res.status(500).json({ err, message: 'Error al crear el Expediente', ok: false });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const changeStatus = {
                    status: false
                };
                const file = yield fileMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!file) {
                    return res.status(404).json({
                        message: 'No se encontro el Expediente',
                        ok: false
                    });
                }
                return res.json({
                    file,
                    message: `Expediente ${file.affair} borrado`,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro el Expediente',
                    ok: false
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield fileMdl_1.default.find().populate('assigned_client');
                res.status(200).json({ files, ok: true });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'affair', page = 1, perPage = 10, orderField, orderType, status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'assigned_client'
                        }
                    ],
                    sort: {
                        title: 1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                const query = {
                    $and: [
                        {
                            [filterOpt]: filtroE
                        },
                        {
                            status
                        },
                    ],
                    $or: [
                        {
                            user: req.user._id
                        },
                        {
                            assigned_client: req.user._id
                        }
                    ]
                };
                console.log(query);
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const files = yield fileMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    files,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield fileMdl_1.default.findOne({ _id: req.
                        params.id }).populate('assigned_client');
                res.status(200).json({ ok: true, file });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    tracking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield fileMdl_1.default.findOne({
                    _id: req.
                        params.id
                }).populate('assigned_client');
                res.status(200).json({ ok: true, file });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.body)
                // return;
                const { id } = req.params;
                if (req.body.volume || req.body.advance) {
                    let fileV = yield fileMdl_1.default.findOne({ _id: id });
                    console.log(fileV.volumes.length);
                    return;
                    let num = 0;
                    num += Number(fileV.volumes.length) + 1;
                    const newVolume = {
                        num,
                        volume: 'hahahah/20/04'
                    };
                    const newKey = {
                        num,
                        intKey: 'hahahah/20/04'
                    };
                    const file = yield fileMdl_1.default.findOneAndUpdate({ _id: id }, {
                        $push: {
                            intKeys: newKey,
                            volumes: newVolume
                        }
                    }, {
                        new: true
                    });
                    return res.json({ file, message: 'Expediente actualizado correctamente', ok: true });
                }
                else {
                    const file = yield fileMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                        new: true
                    });
                    return res.json({ file, message: 'Expediente actualizado correctamente', ok: true });
                }
            }
            catch (err) {
                res.status(500).json({ err, message: 'Error al actualizar el Expediente', ok: false });
            }
        });
    }
}
const fileController = new FileController();
exports.default = fileController;
