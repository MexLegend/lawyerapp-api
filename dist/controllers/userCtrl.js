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
const contactMdl_1 = __importDefault(require("../models/contactMdl"));
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const userMdl_1 = __importDefault(require("../models/userMdl"));
class UserController {
    // Validate If An User Email Is Used Already
    checkEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield userMdl_1.default.findOne({ email });
                if (user !== null) {
                    return res.json({
                        ok: true,
                        exist: true,
                        message: 'El email ya esta en uso',
                        user
                    });
                }
                else {
                    return res.json({ ok: true, exist: false });
                }
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, ok: false, message: 'Error al encontrar usuario' });
            }
        });
    }
    // Insert a New Row/Document Into The Users Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { address, cellPhone, email, firstName, lastName, password, role } = req.body.user;
                const userN = {
                    address,
                    cellPhone,
                    email,
                    firstName,
                    img: req.body.img ? req.body.img.url : null,
                    lawyers: { lawyer: req.body.lawyer ? req.body.lawyer : null },
                    lastName,
                    password: bcryptjs_1.hashSync(password, 10),
                    public_id: req.body.img ? req.body.img.public_id : '',
                    public_lawyer_id: req.body.public_lawyer_id,
                    role
                };
                const user = yield userMdl_1.default.create(userN);
                // Create Contact
                if (req.body.lawyer && role !== 'NEW') {
                    // Add Client Contact To Lawyer Contacts List
                    yield contactMdl_1.default.findOneAndUpdate({
                        user: req.body.lawyer
                    }, { $push: { contacts: { contact: user._id } } }, { upsert: true });
                    // Add Lawyer Contact To Client Contacts List
                    yield contactMdl_1.default.findOneAndUpdate({
                        user: user._id
                    }, { $push: { contacts: { contact: req.body.lawyer } } }, { upsert: true });
                }
                res
                    .status(201)
                    .json({ ok: true, user, message: 'Usuario creado correctamente' });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, ok: false, message: 'Error al crear el usuario' });
            }
        });
    }
    // Delete Temporary a Row/Document From The Users Collection
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
    // Get All Rows/Documents From Users Collection
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
                    $or: req.user.role === 'ADMIN'
                        ? [
                            {
                                _id: { $ne: req.user._id }
                            }
                        ]
                        : [
                            {
                                _id: { $ne: req.user._id },
                                'lawyers.lawyer': req.user._id
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
    // Get Lawyer From Users Collection
    getLawyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lawyer = yield userMdl_1.default.findOne({ _id: req.params.id }).populate('practice_areas.practice_area');
                return res.status(200).json({
                    lawyer,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From Users Collection With Rol Condition
    getLawyers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lawyers = yield userMdl_1.default.find({
                    $or: [
                        {
                            role: { $in: ['ADMIN', 'ASSOCIATED'] }
                        }
                    ]
                }).sort({ firstName: 1 });
                return res.status(200).json({
                    lawyers: lawyers,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Users Collection
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
    // Update One or More Rows/Documents From Users Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // return;
            try {
                const { id } = req.params;
                let userG = yield userMdl_1.default.findOne({ _id: id });
                let userU;
                let user;
                if (req.body.img) {
                    if (userG.public_id &&
                        userG.public_id !== undefined &&
                        userG.public_id !== '') {
                        yield cloudinary.v2.uploader.destroy(userG.public_id);
                    }
                }
                if (req.body.user) {
                    const { address, biography, cellPhone, email, firstName, lastName, role } = req.body.user;
                    userU = {
                        role: role !== '' ? role : userG.role,
                        address: address !== '' ? address : userG.address,
                        biography: biography !== '' ? biography : userG.biography,
                        cellPhone: cellPhone !== '' ? cellPhone : userG.cellPhone,
                        email: email !== '' ? email : userG.email,
                        firstName: firstName !== '' ? firstName : userG.firstName,
                        lastName: lastName !== '' ? lastName : userG.lastName,
                        img: req.body.img ? req.body.img.url : userG.img,
                        public_id: req.body.img ? req.body.img.public_id : userG.public_id
                    };
                    user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, userU, {
                        new: true
                    });
                }
                return res.json({
                    ok: true,
                    message: 'Datos actualizados correctamente',
                    user
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, ok: false, message: 'Error al actualizar el Usuario' });
            }
        });
    }
    // Update The Image From One Row/Document Of Users Collection
    updateImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                let userG = yield userMdl_1.default.findOne({ _id: id });
                let userU;
                let user;
                if (req.body.url) {
                    if (userG.public_id &&
                        userG.public_id !== undefined &&
                        userG.public_id !== '') {
                        yield cloudinary.v2.uploader.destroy(userG.public_id);
                    }
                    userU = {
                        img: req.body.url ? req.body.url : userG.img,
                        public_id: req.body.public_id ? req.body.public_id : userG.public_id
                    };
                    user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, userU, {
                        new: true
                    });
                }
                return res.json({
                    ok: true,
                    message: 'Imagen de perfil actualizada',
                    user
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    ok: false,
                    message: 'Error al actualizar la Imagen de perfil'
                });
            }
        });
    }
    // Update Specific Rows/Documents From Users Collection
    updateUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateAction = () => {
                    switch (req.body.action) {
                        case 'Nombre':
                            return {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName
                            };
                        case 'Género':
                            return {
                                gender: req.body.gender
                            };
                        case 'Contraseña':
                            return {
                                password: bcryptjs_1.hashSync(req.body.newPassword, 10)
                            };
                        case 'Email':
                            return {
                                email: req.body.userEmail
                            };
                        case 'Teléfono':
                            return {
                                cellPhone: req.body.cellPhone
                            };
                        case 'Dirección':
                            return {
                                cellPhone: req.body.address
                            };
                        case 'Biografía':
                            return {
                                cellPhone: req.body.biography
                            };
                        default:
                            return {
                                practice_areas: req.body.practiceAreas
                            };
                    }
                };
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, updateAction(), {
                    new: true
                });
                return res.json({
                    ok: true,
                    message: 'Datos actualizados correctamente',
                    user
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, ok: false, message: 'Error al actualizar el Usuario' });
            }
        });
    }
    // Update The Password From One Row/Document Of Users Collection
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
                                return res.json({
                                    message: 'Contraseña actualizada correctamente',
                                    ok: true,
                                    user
                                });
                            }
                            else {
                                return res.json({
                                    message: 'La contraseña debe tener al menos 9 caracteres',
                                    ok: false
                                });
                            }
                        }
                        else {
                            return res.json({
                                message: 'Las contraseñas no coinciden',
                                ok: false
                            });
                        }
                    }
                    else {
                        return res.json({
                            message: 'Contraseña actual incorrecta',
                            ok: false
                        });
                    }
                }
                else {
                    return res.json({
                        message: 'Todos los campos son obligatorios',
                        ok: false
                    });
                }
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Ocurrió un error en el sistema', ok: false });
            }
        });
    }
    // Update The Rol From One Row/Document Of Users Collection
    updateRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield userMdl_1.default.findOneAndUpdate({ _id: id }, { role: req.body.rol }, {
                    new: true
                });
                return res.json({
                    ok: true,
                    message: 'Rol actualizado correctamente',
                    user
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    ok: false,
                    message: 'Error al actualizar el Rol del Usuario'
                });
            }
        });
    }
}
const userController = new UserController();
exports.default = userController;