"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const notificationModel = new SchemaM({
    created_at: {
        type: Date,
        default: Date.now
    },
    image_user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    image_post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post'
    },
    show_buttons: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: [true, 'El titulo es requerido']
    },
    type: {
        type: String,
        required: [true, 'El tipo de notificación es requerido']
    },
    url_path: {
        type: String,
        required: [true, 'El path es requerido']
    },
    user_actor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    user_actor_role: {
        type: String
    }
});
notificationModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Notification', notificationModel);
