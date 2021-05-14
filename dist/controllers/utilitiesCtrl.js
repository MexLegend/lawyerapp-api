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
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class UtilitiesController {
    // Check Token Expiration
    checkToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                let SECRET = process.env.SECRET;
                jsonwebtoken_1.verify(token, SECRET, (err, decoded) => {
                    if (err) {
                        return res.json({
                            err,
                            message: 'Token no válido',
                            ok: false
                        });
                    }
                    else {
                        return res.json({ ok: true, decoded });
                    }
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const utilitiesController = new UtilitiesController();
exports.default = utilitiesController;
