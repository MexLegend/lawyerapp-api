"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const caseModel = new SchemaM({
    actor: {
        type: String,
        required: [true, 'El Actor es requerido']
    },
    affair: {
        type: String,
        required: [true, 'El Asunto es requerido']
    },
    assigned_client: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El Cliente es requerido']
    },
    defendant: {
        type: String,
        required: [true, 'El Demandante es requerido']
    },
    extKey: {
        type: String
    },
    intKey: {
        type: String,
        required: [true, 'La Clave Interna es requerida']
    },
    observations: {
        type: String
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE'
    },
    third: {
        type: String
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
caseModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Case', caseModel);
