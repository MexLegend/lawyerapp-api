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
const mongoose_1 = require("mongoose");
const notificationMdl_1 = __importDefault(require("../models/notificationMdl"));
const usersNotificationsMdl_1 = __importDefault(require("../models/usersNotificationsMdl"));
const server_1 = __importDefault(require("../classes/server"));
const socket_1 = require("../sockets/socket");
class NotificationController {
    // Insert a New Row/Document Into The Notifications Collection
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationData = {
                    image_user: req.body.image_user ? req.body.image_user : null,
                    image_post: req.body.image_post ? req.body.image_post : null,
                    show_buttons: req.body.show_buttons ? req.body.show_buttons : false,
                    title: req.body.title,
                    type: req.body.type,
                    url_path: req.body.url_path,
                    user_actor: mongoose_1.Types.ObjectId(req.body.user_actor),
                    user_actor_role: req.body.user_actor_role
                };
                const server = server_1.default.instance;
                const notificationCreated = yield notificationMdl_1.default.create(notificationData);
                const notificationCreatedCompleted = yield notificationMdl_1.default.findById(notificationCreated._id).populate([{ path: 'image_user' }, { path: 'image_post' }]);
                const userNotificationData = new usersNotificationsMdl_1.default({
                    allowed_roles: req.body.allowed_roles ? req.body.allowed_roles : [],
                    notification_id: notificationCreated._id,
                    user_receiver: req.body.user_receiver
                        ? mongoose_1.Types.ObjectId(req.body.user_receiver)
                        : null,
                    users_viewed: req.body.users_viewed ? req.body.users_viewed : []
                });
                yield usersNotificationsMdl_1.default.create(userNotificationData).then(() => {
                    const notificationCompleted = Object.assign(Object.assign({}, notificationCreatedCompleted._doc), { user_actor: req.body.user_actor_name, allowed_roles: req.body.allowed_roles
                            ? JSON.stringify(req.body.allowed_roles)
                            : [], user_receiver: req.body.user_receiver
                            ? mongoose_1.Types.ObjectId(req.body.user_receiver)
                            : null });
                    // Send Notification To Client By His Socket ID
                    socket_1.connectedUsers.getConnectedUsers().then((users) => {
                        // Get Receiver Id
                        const clientConnected = users.find((user) => user.publicId === req.body.user_receiver);
                        // Get Sender Id
                        const sender = socket_1.connectedUsers.getConnectedUserByPublicId(req.body.user_actor);
                        // Emit Notification To Especific Client Excluding Sender
                        if (clientConnected) {
                            server.io
                                .in(clientConnected.socketId)
                                .emit('get-private-socket-event-notification', notificationCompleted);
                        }
                        else {
                            // Validate If Notification Is For A Group Of Clients
                            if (req.body.allowed_roles) {
                                const clientRoom = req.body.allowed_roles.find((role) => users.find((user) => role === 'ALL'
                                    ? true
                                    : user.userRooms.filter((room) => room === role)));
                                // Validate If Client Is In Especified Room
                                if (clientRoom) {
                                    // Emit Notification To All Connected Clients Excluding Sender
                                    if (clientRoom === 'ALL') {
                                        // Validate If Sender Is Connected
                                        if (sender) {
                                            sender.client.broadcast.emit('get-public-socket-event-notification', notificationCompleted);
                                        }
                                        else {
                                            server.io.emit('get-public-socket-event-notification', notificationCompleted);
                                        }
                                    }
                                    // Emit Notification To A Group Of Connected Clients Excluding Sender
                                    else {
                                        sender.client.broadcast
                                            .to(JSON.stringify(clientRoom))
                                            .emit('get-group-socket-event-notification', notificationCompleted);
                                    }
                                }
                            }
                        }
                        return res.json({
                            notification: notificationCompleted,
                            ok: true
                        });
                    });
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear la notificación', ok: false });
            }
        });
    }
    // Delete Temporary One Row/Document From Notifications Collection
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
    // Get All Rows/Documents From Notifications Collection
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, role } = req.params;
                const userNotifications = yield usersNotificationsMdl_1.default
                    .find({
                    $or: [
                        { user_receiver: id },
                        { allowed_roles: { $in: [role] } },
                        { allowed_roles: { $in: ['ALL'] } }
                    ]
                })
                    .populate({
                    path: 'notification_id',
                    populate: [
                        { path: 'user_actor' },
                        { path: 'image_user' },
                        { path: 'image_post' }
                    ]
                });
                return res.json({
                    notification: userNotifications,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From Notifications Collection
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
    // Update One or More Rows/Documents From Notifications Collection
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
