"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const usersNotificationModel = new SchemaM({
    allowed_roles: [
        {
            type: String
        }
    ],
    is_viewed: {
        type: Boolean,
        default: false
    },
    notification_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Notification',
        required: [true, 'El ID de la notificación es requerido']
    },
    user_receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    users_viewed: [
        {
            viewer_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            },
            viewed_at: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
usersNotificationModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('UserNotification', usersNotificationModel);
