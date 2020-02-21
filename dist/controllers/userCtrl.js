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
const bcryptjs_1 = require("bcryptjs");
const userMdl_1 = __importDefault(require("../models/userMdl"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, cellPhone, email, firstName, lastName, password } = req.body;
                const userN = new userMdl_1.default({
                    address: req.body.address,
                    cellPhone: req.body.cellPhone,
                    email,
                    firstName,
                    lastName,
                    password: bcryptjs_1.hashSync(password, 10)
                });
                const user = yield userMdl_1.default.create(userN);
                res.status(201).json({ ok: true, user, message: 'Usuario creado correctamente' });
            }
            catch (err) {
                res.status(500).json({ err, ok: false, meesage: 'Error al crear el usuario' });
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
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!user) {
                    return res.status(404).json({
                        message: `No se encontro al usuario con id: ${id}`,
                        ok: false
                    });
                }
                return res.json({
                    message: `Usuario ${user.firstName} borrado`,
                    ok: true,
                    user
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: `No se encontro al usuario con id: ${id}`,
                    ok: false
                });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, perPage = 10, filter, orderField, orderType, filterOpt = 'firstName', status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    sort: {
                        firstName: 1
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
                            role: 'USER'
                        }
                    ]
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const users = yield userMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    users,
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
                const user = yield userMdl_1.default.findOne({ _id: req.params.id });
                res.status(200).json({ ok: true, user });
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
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                    new: true
                });
                return res.json({ ok: true, user, message: 'Datos actualizados correctamente' });
            }
            catch (err) {
                res.status(500).json({ err, ok: false, message: 'Error al actualizar el usuario' });
            }
        });
    }
    updatePass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { passAct, passNew, passNewR } = req.body;
                const passHash = bcryptjs_1.hashSync(passNew, 10);
                const user = yield userMdl_1.default.findOne({
                    _id: id
                });
                if (passAct !== '' && passNew !== '' && passNewR !== '') {
                    if (!bcryptjs_1.compareSync(passAct, user.password)) {
                        return res.json({ message: 'Contraseña actual incorrecta' });
                    }
                    else {
                        if (passNew === passNewR) {
                            if (passNew.length > 8) {
                                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, { password: passHash }, {
                                    new: true
                                });
                                return res.json({ ok: true, user, message: 'Contraseña actulizada correctamente' });
                            }
                            else {
                                return res.json({ message: 'La contraseña debe tener al menos 9 caracteres' });
                            }
                        }
                        else {
                            return res.json({ message: 'Las contraseñas no coinciden' });
                        }
                    }
                }
                else {
                    return res.json({ message: 'Todos los campos son obligatorios' });
                }
            }
            catch (err) {
                res.status(500).json({ err, ok: false, message: 'Ocurrió un error en el sistema' });
            }
        });
    }
}
const userController = new UserController();
exports.default = userController;
