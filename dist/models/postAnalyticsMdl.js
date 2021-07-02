"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchemaM = mongoose_1.Schema;
const postAnalyticsModel = new SchemaM({
    comments: [
        {
            comment: {
                type: String
            },
            date: { type: Date, default: Date.now },
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    dislikes: {
        type: Number
    },
    likes: {
        type: Number
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    reactions: [
        {
            date: { type: Date, default: Date.now },
            reaction: {
                type: String
            },
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});
exports.default = mongoose_1.model('PostAnalytics', postAnalyticsModel);
