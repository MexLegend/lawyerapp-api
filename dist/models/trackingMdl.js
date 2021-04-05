"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const trackingModel = new SchemaM({
    date: {
        type: Date,
        default: Date.now
    },
    evidenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Evidence'
    },
    trackingEvidences: [
        {
            evidence: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Evidence'
            }
        }
    ],
    message: {
        type: String
    },
    noteId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Note'
    },
    trackingNotes: [
        {
            note: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Note'
            }
        }
    ],
    status: {
        default: 'ACTIVE',
        type: String
    },
    volume: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Volume',
        required: true
    }
});
trackingModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Tracking', trackingModel);
