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
const bcryptjs_1 = require("bcryptjs");
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const userMdl_1 = __importDefault(require("../models/userMdl"));
class UserController {
    checkEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userMdl_1.default.findOne({ email });
                if (user !== null) {
                    return res.json({ ok: true, exist: true, message: 'El email ya esta en uso', user });
                }
                else {
                    return res.json({ ok: true, exist: false });
                }
            }
            catch (err) {
                res.status(500).json({ err, ok: false, message: 'Error al encontrar usuario' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, cellPhone, email, firstName, lastName, password } = req.body.user;
                const userN = new userMdl_1.default({
                    address,
                    cellPhone,
                    email,
                    firstName,
                    img: req.body.img.url ? req.body.img.url : 'no_image',
                    lastName,
                    password: bcryptjs_1.hashSync(password, 10),
                    public_id: req.body.img.public_id
                        ? req.body.img.public_id
                        : ''
                });
                const user = yield userMdl_1.default.create(userN);
                res.status(201).json({ ok: true, user, message: 'Usuario creado correctamente' });
            }
            catch (err) {
                res.status(500).json({ err, ok: false, message: 'Error al crear el usuario' });
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
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!user) {
                    return res.status(404).json({
                        message: 'No se encontro al Usuario',
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
                    message: 'No se encontro al Usuario',
                    ok: false
                });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter, filterOpt = 'firstName', page = 1, perPage = 10, orderField, orderType, status } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    sort: {
                        firstName: 1
                    }
                };
                let filtroE = new RegExp(filter, 'i');
                const query = {
                    [filterOpt]: filtroE,
                    status,
                    role: 'USER',
                    $or: [
                        {
                            lawyer: req.user._id,
                        },
                    ],
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
                const { address, cellPhone, email, firstName, lastName } = req.body.user;
                const userG = yield userMdl_1.default.findOne({ _id: id });
                if (req.body.img.url) {
                    if (userG.public_id && userG.public_id !== undefined && userG.public_id !== '') {
                        yield cloudinary.v2.uploader.destroy(userG.public_id);
                    }
                }
                const userU = {
                    address: address !== undefined && address !== ''
                        ? address
                        : userG.address,
                    cellPhone: cellPhone !== undefined && cellPhone !== ''
                        ? cellPhone
                        : userG.cellPhone,
                    email: email !== undefined && email !== '' ? email : userG.email,
                    firstName: firstName !== undefined && firstName !== ''
                        ? firstName
                        : userG.firstName,
                    img: req.body.img.url ? req.body.img.url : userG.img,
                    lastName: lastName !== undefined && lastName !== ''
                        ? lastName
                        : userG.lastName,
                    public_id: req.body.img.public_id
                        ? req.body.img.public_id
                        : userG.public_id,
                };
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, userU, {
                    new: true
                });
                return res.json({ ok: true, message: 'Datos actualizados correctamente', user });
            }
            catch (err) {
                res.status(500).json({ err, ok: false, message: 'Error al actualizar el Usuario' });
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
                    if (bcryptjs_1.compareSync(passAct, user.password)) {
                        if (passNew === passNewR) {
                            if (passNew.length > 8) {
                                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, { password: passHash }, {
                                    new: true
                                });
                                return res.json({ message: 'Contraseña actualizada correctamente', ok: true, user });
                            }
                            else {
                                return res.json({ message: 'La contraseña debe tener al menos 9 caracteres', ok: false });
                            }
                        }
                        else {
                            return res.json({ message: 'Las contraseñas no coinciden', ok: false });
                        }
                    }
                    else {
                        return res.json({ message: 'Contraseña actual incorrecta', ok: false });
                    }
                }
                else {
                    return res.json({ message: 'Todos los campos son obligatorios', ok: false });
                }
            }
            catch (err) {
                res.status(500).json({ err, message: 'Ocurrió un error en el sistema', ok: false });
            }
        });
    }
}
const userController = new UserController();
exports.default = userController;
