"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Se importa el módulo de mongoose para realizar la conexión con MongoDB
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() { }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    start() {
        const db = process.env.DB;
        console.log(process.env.DB);
        // Se indica que la conexión será mediante Promesas
        mongoose_1.default.Promise = global.Promise;
        mongoose_1.default.set('useCreateIndex', true);
        // Se establece la conexión a la base de datos mediande el método connect
        mongoose_1.default
            .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
            .then(() => {
            //   Si la conexión es exitosa se emite el siguiente mensaje
            console.log('DB is connect');
        })
            //   Si la conexión es fallida se muestra el error
            .catch((err) => console.log(err));
    }
}
exports.default = Database;
