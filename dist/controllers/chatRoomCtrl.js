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
const chatMessage_Mdl_1 = __importDefault(require("../models/chatMessage.Mdl"));
const chatRoomMdl_1 = __importDefault(require("../models/chatRoomMdl"));
const socket_1 = require("../sockets/socket");
const mongoose_1 = require("mongoose");
const server_1 = __importDefault(require("../classes/server"));
const userMdl_1 = __importDefault(require("../models/userMdl"));
class ChatRoomController {
    // Insert a New Row/Document Into The ChatRooms Collection
    createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomData, messageData } = req.body;
                const server = server_1.default.instance;
                const roomCreated = yield chatRoomMdl_1.default.create(roomData);
                // Create Room In Users Collection
                yield userMdl_1.default.updateMany({
                    _id: { $in: roomCreated.members.map((member) => member.member) }
                }, { $push: { rooms: { room: roomCreated._id, type: '' } } });
                const messagesCreated = yield chatMessage_Mdl_1.default.create({
                    chat_room_id: roomCreated._id,
                    messages: {
                        author_id: roomData.creator_id,
                        message: messageData.message
                    }
                });
                const populatedMessage = yield chatMessage_Mdl_1.default.findOne({
                    _id: messagesCreated._id
                }).populate('messages.author_id');
                // Update Last Message Id, Populate Room Members And Send Message Notifications To Client
                yield chatRoomMdl_1.default.findOne({
                    _id: roomCreated._id
                })
                    .populate('last_message_id')
                    .populate('members.member')
                    .exec((err, data) => {
                    const chat = {
                        roomData: data,
                        messageData: populatedMessage,
                        isCreating: true
                    };
                    // Validate If Clients Are Connected To Send Them The Message
                    socket_1.connectedUsers.getConnectedUsers().then((users) => {
                        let clientsConnected = [];
                        users.filter((user) => {
                            data.members.filter((member) => {
                                if (JSON.stringify(member.member._id) ===
                                    JSON.stringify(user.publicId)) {
                                    clientsConnected.push(user);
                                    socket_1.connectedUsers.addUserToRoom(user.client, roomCreated._id);
                                }
                                else
                                    return;
                            });
                        });
                        // Emit Notification To All Connected Clients Including Sender
                        if (clientsConnected.length > 0) {
                            server.io
                                .in(JSON.stringify(roomCreated._id))
                                .emit('get-group-message-event', chat);
                        }
                    });
                    return res.json({
                        chat,
                        message: 'Sala creada correctamente',
                        ok: true
                    });
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear la Sala', ok: false });
            }
        });
    }
    // Insert a New Row/Document Into The ChatMessages Collection
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, messageData } = req.body;
                const server = server_1.default.instance;
                const tempMessageData = {
                    author_id: mongoose_1.Types.ObjectId(messageData.creator_id),
                    message: messageData.message,
                    attachments: [],
                    created_at: Date.now(),
                    updated_at: Date.now()
                };
                yield chatMessage_Mdl_1.default.findOneAndUpdate({
                    chat_room_id: mongoose_1.Types.ObjectId(roomId)
                }, {
                    $push: {
                        messages: tempMessageData
                    }
                }, {
                    new: true,
                    fields: { messages: { $slice: -1 } }
                })
                    .populate({
                    path: 'chat_room_id',
                    populate: [{ path: 'members.member' }]
                })
                    .populate('messages.author_id')
                    .exec((err, messageData) => {
                    // Validate If Client Message Is Connected
                    socket_1.connectedUsers.getConnectedUsers().then((users) => {
                        let clientsConnected = [];
                        users.filter((user) => {
                            messageData.chat_room_id.members.filter((member) => {
                                if (JSON.stringify(member.member._id) ===
                                    JSON.stringify(user.publicId)) {
                                    clientsConnected.push(user);
                                }
                                else
                                    return;
                            });
                        });
                        // Emit Notification To All Connected Clients Including Sender
                        if (clientsConnected.length > 0) {
                            server.io
                                .in(JSON.stringify(messageData.chat_room_id._id))
                                .emit('get-group-message-event', {
                                messageData,
                                isCreating: false
                            });
                        }
                    });
                    return res.json({
                        message: messageData,
                        ok: true
                    });
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al crear el mensaje', ok: false });
            }
        });
    }
    // Get All Rows/Documents From ChatRooms Collection
    getRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idUser = req.params.id;
                const rooms = yield chatRoomMdl_1.default.find({
                    members: { $elemMatch: { member: { $in: [mongoose_1.Types.ObjectId(idUser)] } } }
                });
                const completeRooms = yield chatMessage_Mdl_1.default.find({
                    chat_room_id: { $in: rooms.map((room) => room._id) }
                }, {
                    messages: { $slice: -1 }
                })
                    .populate('messages.author_id')
                    .populate({
                    path: 'chat_room_id',
                    populate: [{ path: 'members.member' }]
                });
                return res.status(200).json({
                    completeRooms,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get All Rows/Documents From ChatMessages Collection
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idRoom = req.params.id;
                const messages = yield chatMessage_Mdl_1.default.find({
                    chat_room_id: mongoose_1.Types.ObjectId(idRoom)
                }).populate('messages.author_id');
                return res.status(200).json({
                    messages,
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get Last Row/Document From ChatMessages Collection
    getLastMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const idRoom = req.params;
                const lastMessage = yield chatMessage_Mdl_1.default.findOne({
                    chat_room_id: mongoose_1.Types.ObjectId(idRoom)
                }, {
                    new: true,
                    fields: { messages: { $slice: -1 } }
                }).populate('messages.author_id');
                return res.status(200).json({
                    ok: true,
                    message: lastMessage
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From ChatRooms Collection
    getOneRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                return res.status(200).json({
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Get One Row/Document From ChatMessages Collection
    getOneMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                return res.status(200).json({
                    ok: true
                });
            }
            catch (err) {
                res.status(500).json({ err, ok: false });
            }
        });
    }
    // Update One or More Rows/Documents From ChatRooms Collection
    updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.json({
                    message: 'Nota actualizada correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
            }
        });
    }
    // Delete Temporary a Row/Document From The ChatRooms Collection
    deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase, idNote } = req.params;
                return res.json({
                    message: 'Nota actualizada correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
            }
        });
    }
    // Delete Permanently a Row/Document From The Cases Collection
    deleteMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idCase, idNote } = req.params;
                return res.json({
                    message: 'Nota actualizada correctamente',
                    ok: true
                });
            }
            catch (err) {
                res
                    .status(500)
                    .json({ err, message: 'Error al actualizar la Evidencia', ok: false });
            }
        });
    }
}
const chatRoomController = new ChatRoomController();
exports.default = chatRoomController;
