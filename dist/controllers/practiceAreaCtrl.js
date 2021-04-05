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
const practiceArea_Mdl_1 = __importDefault(require("../models/practiceArea.Mdl"));
const userMdl_1 = __importDefault(require("../models/userMdl"));
class PracticeAreaController {
    // Insert a New Row/Document Into The Practice Areas Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { author, practiceAreaData, lawyersList } = req.body;
                const practiceArea = yield practiceArea_Mdl_1.default.create(Object.assign(Object.assign({}, practiceAreaData), { author: author._id }));
                const authorLawyerName = author.firstName + ' ' + author.lastName;
                // Add Created Practice Area To Lawyers List
                yield userMdl_1.default.updateMany({
                    _id: { $in: lawyersList.map((lawyerId) => lawyerId) }
                }, { $push: { practice_areas: { practice_area: practiceArea._id } } });
                res.status(201).json({
                    message: 'Área de práctica creada correctamente',
                    ok: true,
                    practiceArea
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'Error al crear la área de práctica',
                    ok: false
                });
            }
        });
    }
    // Delete Completly a Row/Document From The Practice Areas Collection
    deleteCompletly(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea } = req.params;
                const practiceArea = yield practiceArea_Mdl_1.default.findByIdAndDelete({
                    _id: idPracticeArea
                });
                // Delete Pactice Area From All Users Collection
                yield userMdl_1.default.updateMany({
                    practice_areas: {
                        practice_area: { $elemMatch: { _id: idPracticeArea } }
                    }
                }, {
                    $set: {
                        practice_areas: {
                            practice_area: { $ne: { _id: idPracticeArea } }
                        }
                    }
                });
                if (!practiceArea) {
                    return res.status(404).json({
                        message: 'No se encontro la área de práctica',
                        ok: false
                    });
                }
                return res.json({
                    message: `Área de práctica ${practiceArea.name} eliminada completamente`,
                    ok: true,
                    practiceArea
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro la área de práctica',
                    ok: false
                });
            }
        });
    }
    // Delete Pactice Area From One Lawyer Of Users Collection
    deleteSpecializedLawyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea } = req.params;
                const { lawyers } = req.body;
                const specializedLawyers = yield userMdl_1.default.updateMany({
                    _id: { $in: lawyers.map((lawyerId) => lawyerId) }
                }, {
                    $set: {
                        practice_areas: {
                            practice_area: { $ne: { _id: idPracticeArea } }
                        }
                    }
                });
                res.status(200).json({ ok: true, specializedLawyers });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The Practice Areas Collection
    deleteTemporary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea } = req.params;
                const changeStatus = {
                    status: false
                };
                const practiceArea = yield practiceArea_Mdl_1.default.findByIdAndUpdate({ _id: idPracticeArea }, changeStatus, {
                    new: true
                });
                if (!practiceArea) {
                    return res.status(404).json({
                        message: 'No se encontro la área de práctica',
                        ok: false
                    });
                }
                return res.json({
                    message: `Área de práctica ${practiceArea.name} enviada a la papelera`,
                    ok: true,
                    practiceArea
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'No se encontro la área de práctica',
                    ok: false
                });
            }
        });
    }
    // Get All Rows/Documents From Practice Areas Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, perPage = 10, orderField, orderType, status, processState, is_category } = req.query;
                const options = {
                    page: parseInt(page, 10),
                    limit: parseInt(perPage, 10),
                    populate: [
                        {
                            path: 'author'
                        }
                    ],
                    sort: {
                        created_at: 1
                    }
                };
                let processStateQuery = processState === 'ALL'
                    ? [
                        {
                            status
                        },
                        is_category === 'true' ? {} : { is_category }
                    ]
                    : [
                        {
                            status
                        },
                        is_category === 'true' ? {} : { is_category },
                        {
                            processState: processState
                        }
                    ];
                const query = {
                    $and: processStateQuery
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const practiceAreas = yield practiceArea_Mdl_1.default.paginate(query, options);
                return res.status(200).json({
                    practiceAreas: practiceAreas.docs,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Practice Areas Collection
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const practiceArea = yield practiceArea_Mdl_1.default.findOne({
                    _id: req.params.idPracticeArea
                });
                res.status(200).json({ ok: true, practiceArea });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From Users Collection Where Parctice Area Matches
    getSpecializedLawyers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specializedLawyers = yield userMdl_1.default.find({
                    practice_areas: {
                        $elemMatch: { practice_area: req.params.idPracticeArea }
                    }
                });
                res.status(200).json({ ok: true, specializedLawyers });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From Practice Areas Collection
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea } = req.params;
                const { practiceAreaData, lawyersList: { newLawyers, removedLawyers } } = req.body;
                if (newLawyers.length > 0) {
                    yield userMdl_1.default.updateMany({
                        _id: { $in: newLawyers.map((newLawyerId) => newLawyerId) }
                    }, { $push: { practice_areas: { practice_area: idPracticeArea } } });
                }
                if (removedLawyers.length > 0) {
                    yield userMdl_1.default.updateMany({
                        _id: {
                            $in: removedLawyers.map((removedLawyerId) => removedLawyerId)
                        }
                    }, {
                        $pull: {
                            practice_areas: {
                                practice_area: { _id: idPracticeArea }
                            }
                        }
                    });
                }
                const practiceArea = yield practiceArea_Mdl_1.default.findByIdAndUpdate({ _id: idPracticeArea }, practiceAreaData, {
                    new: true
                });
                return res.json({
                    message: 'Área de práctica actualizada correctamente',
                    ok: true,
                    practiceArea
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'Error al actualizar la área de práctica',
                    ok: false
                });
            }
        });
    }
    // Add Lawyer Into One Practice Area
    updateSpecializedLawyer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea, idLawyer } = req.body;
                const specializedLawyer = yield userMdl_1.default.findByIdAndUpdate({ _id: idLawyer }, { $push: { practice_areas: { practice_area: idPracticeArea } } }, {
                    new: true
                });
                if (!specializedLawyer) {
                    return res.status(404).json({
                        message: 'No se encontro el abogado',
                        ok: false
                    });
                }
                return res.json({
                    specializedLawyer,
                    message: `Abogado ${specializedLawyer.firstName + ' ' + specializedLawyer.lastName} agregado la área de práctica.`,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'Error al actualizar la área de práctica',
                    ok: false
                });
            }
        });
    }
    // Change The State To Publish One Row/Document Of Practice Areas Collection
    updateState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idPracticeArea } = req.params;
                const changeStatus = {
                    processState: req.body.processState
                };
                const state = req.body.processState === 'APPROVED' ? 'aprobada' : 'en espera';
                const practiceArea = yield practiceArea_Mdl_1.default.findByIdAndUpdate({ _id: idPracticeArea }, changeStatus, {
                    new: true
                });
                if (!practiceArea) {
                    return res.status(404).json({
                        message: 'No se encontro la área de práctica',
                        ok: false
                    });
                }
                return res.json({
                    practiceArea,
                    message: `Área de práctica ${practiceArea.name} ${state}.`,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'Error al actualizar la área de práctica',
                    ok: false
                });
            }
        });
    }
}
const practiceAreaController = new PracticeAreaController();
exports.default = practiceAreaController;
