"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const newsLetterModel = new SchemaM({
    email: {
        type: String,
        required: [true, 'El Email es requerido']
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    suscribed_at: {
        type: Date,
        default: Date.now
    }
});
newsLetterModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('NewsLetter', newsLetterModel);
