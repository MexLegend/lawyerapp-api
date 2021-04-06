"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const postModel = new SchemaM({
    attachedFiles: [
        {
            allowed_roles: [
                {
                    type: String,
                    default: 'NEW'
                }
            ],
            date: {
                type: Date,
                default: Date.now
            },
            name: {
                type: String
            },
            path: {
                type: String
            },
            public_id: {
                type: String
            },
            size: {
                type: String
            },
            status: {
                type: String,
                default: true
            },
            required: false
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    postCategories: [
        {
            category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'PracticeArea' },
            required: false
        }
    ],
    postContent: {
        type: String,
        required: [true, 'El Contenido es requerido']
    },
    postFolder: {
        type: String,
        required: [true, 'El Folder es requerido']
    },
    postImage: {
        type: String,
        default: null,
        required: false
    },
    postImagesList: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            image_id: {
                type: String
            },
            path: {
                type: String
            },
            public_id: {
                type: String
            },
            required: false
        }
    ],
    postTitle: {
        type: String,
        required: [true, 'El Titulo es requerido']
    },
    postQuotes: [
        {
            quoteType: {
                type: String,
                required: [true, 'El tipo de la cita es requerido']
            },
            quoteAuthor: { type: String, required: false },
            quotePageName: { type: String, required: false },
            quoteWebSiteName: { type: String, required: false },
            quoteYear: { type: Number, required: false },
            quoteMonth: { type: String, required: false },
            quoteDay: { type: Number, required: false },
            quoteUrl: { type: String, required: false },
            quoteTitle: { type: String, required: false },
            quoteCity: { type: String, required: false },
            quotePublisher: { type: String, required: false },
            quoteCaseNumber: { type: String, required: false },
            quoteCourt: { type: String, required: false },
            quotePages: { type: String, required: false },
            quotePeriodicalTitle: { type: String, required: false },
            quoteJournalName: { type: String, required: false },
            quoteInventor: { type: String, required: false },
            quoteCountry: { type: String, required: false },
            quotePatentNumber: { type: String, required: false }
        }
    ],
    processState: {
        type: String,
        required: false
    },
    public_id: {
        type: String,
        required: false
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
postModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('Post', postModel);
