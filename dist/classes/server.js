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
const socket_io_1 = __importDefault(require("socket.io"));
const path_1 = require("path");
const multer = require('multer');
const serveIndex = require('serve-index');
const storage = multer.diskStorage({
    destination: path_1.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const socket = __importStar(require("../sockets/socket"));
const emailRts_1 = __importDefault(require("../routes/emailRts"));
const fileRts_1 = __importDefault(require("../routes/fileRts"));
const loginRts_1 = __importDefault(require("../routes/loginRts"));
const notificationRts_1 = __importDefault(require("../routes/notificationRts"));
const postRts_1 = __importDefault(require("../routes/postRts"));
const trackingRts_1 = __importDefault(require("../routes/trackingRts"));
const userRts_1 = __importDefault(require("../routes/userRts"));
const whatsappRts_1 = __importDefault(require("../routes/whatsappRts"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        this.httpServer = new http_1.default.Server(this.app);
        this.io = socket_io_1.default(this.httpServer);
        this.listenSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    config() {
        this.app.use(cors_1.default({ origin: true, credentials: true }));
        this.app.use(multer({ storage, fileFilter: (req, file, cb) => {
                let validExtensions = [
                    'doc',
                    'docx',
                    'pdf',
                ];
                // console.log(extname(file.originalname).split('.')[1]);
                let extension = path_1.extname(file.originalname).split('.')[1];
                if (validExtensions.indexOf(extension) < 0) {
                    return cb(new Error('Only pdfs are allowed'));
                }
                cb(null, true);
            } }).array('files'));
        this.app.use(express_1.default.json({ limit: '20mb' }));
        this.app.use(express_1.default.urlencoded({ extended: false, limit: '20mb' }));
        // this.app.use(express.static(join(__dirname, '../public'))
        // );
        // console.log(join(__dirname, '../public'));
        this.app.use('/ftp', express_1.default.static(path_1.join(__dirname, '../public')), serveIndex(path_1.join(__dirname, '../public'), { icons: true }));
    }
    routes() {
        this.app.use('/api/posts', postRts_1.default);
        this.app.use('/api/email', emailRts_1.default);
        this.app.use('/api/files', fileRts_1.default);
        this.app.use('/api/login', loginRts_1.default);
        this.app.use('/api/notifications', notificationRts_1.default);
        this.app.use('/api/tracking', trackingRts_1.default);
        this.app.use('/api/users', userRts_1.default);
        this.app.use('/api/whatsapp', whatsappRts_1.default);
    }
    listenSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', (cliente) => {
            socket.existUser(cliente, this.io);
            socket.notification(cliente, this.io);
            socket.disconnect(cliente);
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
