"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const evidenceModel = new SchemaM({
    case: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    evidences: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            name: {
                type: String
            },
            path: {
                type: String
            },
            public_id: {
                type: String,
                required: false
            },
            size: {
                type: String
            },
            status: {
                type: String,
                default: 'PUBLIC'
            }
        }
    ]
});
evidenceModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Evidence', evidenceModel);
