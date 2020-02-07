"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const postModel = new SchemaM({
    author: {
        type: String
    },
    content: {
        type: String,
        required: [true, 'El Contenido es requerido']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    img: {
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
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
postModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Post', postModel);
