"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const SchemaM = mongoose_1.Schema;
const documentFileModel = new SchemaM({
    date: {
        type: Date,
        default: Date.now
    },
    uri: {
        type: String
    }
});
documentFileModel.plugin(mongoose_paginate_1.default);
exports.default = mongoose_1.model('DocumentFile', documentFileModel);
