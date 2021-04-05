"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const chatMessageModel = new SchemaM({
    chat_room_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: [true, 'The messages room is required']
    },
    messages: [
        {
            attachments: [
                {
                    type: {
                        type: String
                    },
                    file_id: {
                        type: mongoose_1.Schema.Types.ObjectId,
                        ref: 'Files'
                    }
                }
            ],
            author_id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: [true, 'The messages author is required']
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            deleted: {
                is_deleted: {
                    type: Boolean
                },
                deleted_by: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'User'
                }
            },
            message: {
                type: String
            },
            status: {
                type: String
            },
            updated_at: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
chatMessageModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('ChatMessage', chatMessageModel);
