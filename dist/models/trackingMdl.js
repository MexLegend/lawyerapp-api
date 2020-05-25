"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const trackingModel = new SchemaM({
    comments: [
        {
            comment: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            numV: Number
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    documents: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            document: {
                type: String
            },
            numV: Number
        }
    ],
    file: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'File',
        required: true
    },
    status: {
        type: String
    },
    track: {
        type: Number
    },
    volumes: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            num: {
                type: Number
            }
        }
    ],
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
trackingModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Tracking', trackingModel);
