"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const chatRoomModel = new SchemaM({
    created_at: {
        type: Date,
        default: Date.now
    },
    creator_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: null
    },
    name: {
        type: String,
        default: null
    },
    members: [
        {
            member: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            },
            role: {
                type: String,
                default: 'Member'
            }
        }
    ],
    updated_at: {
        type: Date,
        default: Date.now
    }
});
chatRoomModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('ChatRoom', chatRoomModel);
