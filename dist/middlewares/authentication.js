"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const secret = process.env.SECRET;
exports.AUTH = {
    verifyToken(req, res, next) {
        let token = req.get('token');
        jsonwebtoken_1.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    err,
                    message: 'Token no válido',
                    ok: false
                });
            }
            req.user = decoded.user;
            next();
        });
    },
    verifyAdmin(req, res, next) {
        let user = req.user;
        if (user.role === 'ADMIN') {
            next();
        }
        else {
            return res.status(401).json({
                message: 'El user no es ADMIN',
                ok: false
            });
        }
    },
    verifyAdminSameUser(req, res, next) {
        const user = req.user;
        const id = req.params.id;
        if (user.role === 'ADMIN' || user._id === id) {
            next();
            return;
        }
        else {
            return res.status(401).json({
                message: 'Token incorrecto - No es ADMIN o el USUARIO LOGUEADO',
                ok: false
            });
        }
    },
    verifyTokenImg(req, res, next) {
        let token = req.query.token;
        jsonwebtoken_1.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    err,
                    message: 'Token no válido',
                    ok: false
                });
            }
            req.user = decoded.user;
            next();
        });
    }
};
