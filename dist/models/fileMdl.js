"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const fileModel = new SchemaM({
    affair: {
        type: String,
        required: [true, 'El Asunto es requerido']
    },
    assigned_client: {
        type: String,
        required: [true, 'El Cliente es requerido']
    },
    description: {
        type: String,
        required: [true, 'La Descripcion es requerida']
    },
    end_date: {
        type: Date
    },
    key: {
        type: String
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
fileModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('File', fileModel);
