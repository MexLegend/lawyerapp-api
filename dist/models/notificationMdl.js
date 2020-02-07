"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const notificationModel = new SchemaM({
    body: {
        type: String,
        required: [true, 'El Contenido es requerido']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    icon: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        required: [true, 'El Titulo es requerido']
    },
    typeU: {
        type: String,
        required: [true, 'El Tipo es requerido']
    },
    view: {
        type: Boolean,
        default: false
    },
});
notificationModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Notification', notificationModel);
