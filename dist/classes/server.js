"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const multer = require("multer");
const path_1 = require("path");
const socket_io_1 = __importDefault(require("socket.io"));
const storage = multer.diskStorage({
    destination: path_1.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path_1.extname(file.originalname));
    }
});
const socket = __importStar(require("../sockets/socket"));
const emailRts_1 = __importDefault(require("../routes/emailRts"));
const fileRts_1 = __importDefault(require("../routes/fileRts"));
const loginRts_1 = __importDefault(require("../routes/loginRts"));
const notificationRts_1 = __importDefault(require("../routes/notificationRts"));
const postRts_1 = __importDefault(require("../routes/postRts"));
const userRts_1 = __importDefault(require("../routes/userRts"));
const whatsappRts_1 = __importDefault(require("../routes/whatsappRts"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.escucharSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    config() {
        this.app.use(multer({ storage }).single('img'));
        this.app.use(cors_1.default({ origin: true, credentials: true }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api/posts', postRts_1.default);
        this.app.use('/api/email', emailRts_1.default);
        this.app.use('/api/files', fileRts_1.default);
        this.app.use('/api/login', loginRts_1.default);
        this.app.use('/api/notifications', notificationRts_1.default);
        this.app.use('/api/users', userRts_1.default);
        this.app.use('/api/whatsapp', whatsappRts_1.default);
    }
    escucharSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', (cliente) => {
            socket.existeUser(cliente, this.io);
            socket.notificacion(cliente, this.io);
            socket.desconectar(cliente);
        });
    }
    start() {
        const port = process.env.PORT || 3000;
        this.httpServer.listen(port, () => {
            console.log(`Server On Port: ${port}`);
        });
    }
}
exports.default = Server;
