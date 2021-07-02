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
const jsonwebtoken_1 = require("jsonwebtoken");
const userMdl_1 = __importDefault(require("../models/userMdl"));
exports.default = {
    // Allow Users To Loggin In The System
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield userMdl_1.default.findOne({
                    email: userData.email
                }).populate('ratings');
                // Emails Doesn't Exist
                if (!user) {
                    return res.json({
                        type: 'notExist',
                        ok: false,
                        user
                    });
                }
                // Wrong Credentials
                if (!bcryptjs_1.compareSync(userData.password, user.password)) {
                    return res.json({
                        type: 'wrongCredentials',
                        ok: false,
                        user
                    });
                }
                // Account Not Confirmed
                if (!user.isConfirmed) {
                    return res.json({
                        type: 'notConfirmed',
                        ok: false,
                        user
                    });
                }
                const SECRET = process.env.SECRET;
                let token = jsonwebtoken_1.sign({
                    user
                }, SECRET, {
                    expiresIn: process.env.EXPIRATION
                });
                res.json({
                    ok: true,
                    token,
                    user
                });
            }
            catch (err) {
                return res.status(500).json({
                    err,
                    ok: false
                });
            }
        });
    }
};
