"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const noteModel = new SchemaM({
    case: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    notes: [
        {
            affair: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            },
            message: {
                type: String
            },
            status: {
                type: String,
                default: 'PUBLIC'
            }
        }
    ]
});
noteModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Note', noteModel);
