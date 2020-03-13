"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const fileModel = new SchemaM({
    actor: {
        type: String,
        required: [true, 'El Actor es requerido']
    },
    advances: [
        {
            advance: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
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
    description: {
        type: String
    },
    documents: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            document: {
                type: String
            }
        }
    ],
    intKeys: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            intKey: {
                type: String,
                required: [true, 'La Clave Interna es requerida']
            },
            num: {
                type: Number
            }
        }
    ],
    third: {
        type: String
    },
    extKey: {
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
    },
    volumes: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            num: {
                type: Number
            },
            volume: {
                type: String
            }
        }
    ],
});
fileModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('File', fileModel);
