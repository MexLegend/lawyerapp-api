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
const web_push_1 = require("web-push");
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
class NotificationController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const sub = req.body;
            res.set('Content-Type', 'application/json');
            web_push_1.setVapidDetails('mailto:example@yourdomain.com', 'BDrqtmJ0LDNmKOZ_FueB6Qf9qs3Peh6s5NdcsTrpHhPpsRKElfXdWuPrZM1bbUT9gVHx89wUC8-MVFPJbcPB9Oo', 'ldMrew1LrHU_FPpG7cWRQM28H0zj1GjTO2S0XxivsKg');
            const payload = JSON.stringify({
                notification: {
                    title: 'Notifications are cool',
                    body: 'Know how to send notifications through Angular with this article!',
                    icon: 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png',
                    vibrate: [100, 50, 100],
                    data: {
                        url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
                    }
                }
            });
            Promise.resolve(web_push_1.sendNotification(sub, payload))
                .then(() => res.status(200).json({
                message: 'Notification Sent'
            }))
                .catch((e) => console.log(e));
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const changeStatus = {
                    status: false
                };
                const notification = yield notificationMdl_1.default.findOneAndUpdate({ _id: id }, changeStatus, {
                    new: true
                });
                if (!notification) {
                    return res.status(404).json({
                        message: `No se encontro al notification con id: ${id}`,
                        ok: false
                    });
                }
                return res.json({
                    message: `Notification ${notification.title} borrado`,
                    ok: true,
                    notification
                });
            }
            catch (err) {
                res.status(500).json({
                    err,
                    message: `No se encontro al notification con id: ${id}`,
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
                const { page = 1, perPage = 10, filter, orderField, orderType, filterOpt = 'title', status } = req.query;
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
                        }
                    ]
                };
                if (orderField && orderType) {
                    options.sort = {
                        [orderField]: orderType
                    };
                }
                const notifications = yield notificationMdl_1.default.paginate(query, options);
                return res.status(200).json({
                    notifications,
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
                const notification = yield notificationMdl_1.default.findOne({ _id: req.params.id });
                res.status(200).json({ ok: true, notification });
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
                const notification = yield notificationMdl_1.default.findOneAndUpdate({ _id: id }, req.body, {
                    new: true
                });
                return res.json({ ok: true, notification });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
}
const notificationController = new NotificationController();
exports.default = notificationController;
