"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./classes/database"));
const server_1 = __importDefault(require("./classes/server"));
if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}
database_1.default.instance.start();
server_1.default.instance.start();
