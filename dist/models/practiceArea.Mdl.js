"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const practiceAreaModel = new SchemaM({
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El autor es requerido']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    is_category: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'El Nombre del área de práctica / categoria es requerido']
    },
    processState: {
        type: String,
        required: false,
        default: 'AWAITING'
    },
    quotes: [
        {
            quoteType: {
                type: String,
                required: [true, 'El tipo de la cita es requerido']
            },
            quoteAuthor: { type: String, required: false },
            quotePageName: { type: String, required: false },
            quoteWebSiteName: { type: String, required: false },
            quoteYear: { type: String, required: false },
            quoteMonth: { type: String, required: false },
            quoteDay: { type: String, required: false },
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
            quotePatentNumber: { type: String, required: false },
            required: false
        }
    ],
    review: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
});
practiceAreaModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('PracticeArea', practiceAreaModel);
