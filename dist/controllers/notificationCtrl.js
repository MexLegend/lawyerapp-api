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
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
class NotificationController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('post notification sendddddddddddddddddd');
            // console.log(req.get('typeU'))
            // const subscription = req.body;
            // res.set('Content-Type', 'application/json');
            // const name = req.get('name');
            // const typeU = req.get('typeU');
            // setVapidDetails(
            //   'mailto:example@yourdomain.com',
            //   "BFzRa32U-hCa5uiD2nHyiJx_OBHj3v2q9C_-sjyA_xMy2N6E62Uw8GFfGzMa5bQOgxGceTgajzejbTExleHbMXM",
            //   "tN0H3R3AwtP0DBTKvcdoZCmzSKCnPZzIJEt-bHF9bOo"
            // );
            // let payload = JSON.stringify({
            //   "notification": {
            //     "title": "Pino Y Roble - Abogados",
            //     "body": `${name} actualizo su información general`,
            //     "icon": ""
            //   }
            // });
            // let noti = {
            //   body: 'Gracias por subscribirte!',
            //   icon: '',
            //   title: 'Lawyerapp'
            // }
            // const notiN = new Notification({
            //   body: noti.body,
            //   icon: noti.icon,
            //   title: noti.title,
            //   typeU
            // });
            // await Notification.create(notiN);
            // const notifi = await Notification.find();
            // for (const key in notifi) {
            //   const value: any = notifi[key];
            //   if (value.view === false && value.typeU !== req.user.role && value.typeU !== undefined) {
            //     // console.log("Notify Role: " + value.typeU + "Request Role: " + req.user.role)
            //     Promise.resolve(sendNotification(subscription, payload))
            //       .then(() =>
            //         res.status(200).json({
            //           message: 'Notification sent'
            //         })
            //       )
            //       .catch(err => {
            //         console.log(err);
            //         res.sendStatus(500);
            //       })
            //   }
            // }
            res.status(200).json({
                message: 'Notification sent'
            });
            // res.status(201).json({})
            // const payload = JSON.stringify({ title : 'Push test' })
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
