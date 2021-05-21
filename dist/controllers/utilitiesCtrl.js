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
const jsonwebtoken_1 = require("jsonwebtoken");
const newsLetterMdl_1 = __importDefault(require("../models/newsLetterMdl"));
const userMdl_1 = __importDefault(require("../models/userMdl"));
class UtilitiesController {
    // Check Token Expiration
    checkToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                let SECRET = process.env.SECRET;
                jsonwebtoken_1.verify(token, SECRET, (err, decoded) => {
                    if (err) {
                        const decodedToken = jsonwebtoken_1.decode(token);
                        const responseData = () => __awaiter(this, void 0, void 0, function* () {
                            if (decodedToken.action === 'confirmNewsLetter') {
                                return yield newsLetterMdl_1.default.findById({ _id: decodedToken.id });
                            }
                            else {
                                return yield userMdl_1.default.findById({ _id: decodedToken.id });
                            }
                        });
                        responseData().then((resp) => res.json({
                            err,
                            ok: false,
                            message: 'Token no válido',
                            responseData: Object.assign(Object.assign({}, resp._doc), { action: decodedToken.action }),
                            tokenExpired: true
                        }));
                    }
                    else {
                        const responseData = () => __awaiter(this, void 0, void 0, function* () {
                            switch (decoded.action) {
                                case 'confirmAccount':
                                    return yield userMdl_1.default.findOneAndUpdate({ _id: decoded.id }, { isConfirmed: true }, {
                                        new: true
                                    });
                                case 'confirmNewsLetter':
                                    return yield newsLetterMdl_1.default.findOneAndUpdate({ _id: decoded.id }, { isConfirmed: true }, {
                                        new: true
                                    });
                                default:
                                    return { id: decoded.id };
                                    break;
                            }
                        });
                        responseData()
                            .then((resp) => res.json({ ok: true, responseData: resp }))
                            .catch(() => res.json({ ok: false, tokenExpired: false }));
                    }
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: 'Ocurrió un error en el sistema',
                    tokenExpired: false,
                    ok: false
                });
            }
        });
    }
}
const utilitiesController = new UtilitiesController();
exports.default = utilitiesController;
