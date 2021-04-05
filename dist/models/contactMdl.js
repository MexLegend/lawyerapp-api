"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const contactModel = new SchemaM({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El Usuario es requerido']
    },
    contacts: [
        {
            contact: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ]
});
contactModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Contact', contactModel);
