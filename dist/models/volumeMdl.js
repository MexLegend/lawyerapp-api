"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchemaM = mongoose_1.Schema;
const volumeModel = new SchemaM({
    case: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Case',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE'
    }
});
exports.default = mongoose_1.model('Volume', volumeModel);
