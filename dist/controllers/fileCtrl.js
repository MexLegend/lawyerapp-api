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
const fileMdl_1 = __importDefault(require("../models/fileMdl"));
class FileController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body);
                const fileN = new fileMdl_1.default({
                    affair: body.affair,
                    assigned_client: body.assigned_client,
                    description: body.description,
                    key: body.key,
                    user: req.user._id
                });
                const file = yield fileMdl_1.default.create(fileN);
                res.status(201).json({ ok: true, file });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const changeStatus = {
                    status: false
                };
                const file = yield fileMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!file) {
                    return res.status(404).json({
                        message: `No se encontro al file con id: ${id}`,
                        ok: false
                    });
                }
                return res.json({
                    message: `File ${file.affair} borrado`,
                    ok: true,
                    file
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: `No se encontro al file con id: ${id}`,
                    ok: false
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return console.log(req.body);
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, perPage = 10, filter, orderField, orderType, filterOpt = 'affair', status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
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
                const file = yield fileMdl_1.default.findOne({ _id: req.params.id });
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
                const { id } = req.params;
                const file = yield fileMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                    new: true
                });
                return res.json({ ok: true, file });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const fileController = new FileController();
exports.default = fileController;
