"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() { }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start() {
        const db = process.env.DB;
        console.log(process.env.DB);
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.set('useCreateIndex', true);
        mongoose_1.default
            .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
            .then(() => {
            console.log('DB is connect');
        })
            .catch((err) => console.log(err));
    }
}
exports.default = Database;
