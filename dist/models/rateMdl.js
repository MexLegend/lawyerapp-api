"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const rateModel = new Schema({
    comment: {
        comment: { type: String, default: '' },
        created_at: {
            type: Date,
            default: Date.now
        },
        required: false
    },
    externalModelType: {
        type: String
    },
    data_id: {
        type: Schema.Types.ObjectId,
        ref: 'externalModelType'
    },
    rating: {
        type: Number
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
exports.default = mongoose_1.default.model('Rate', rateModel);
