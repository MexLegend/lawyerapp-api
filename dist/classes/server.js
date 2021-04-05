"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
        let fileN = `${file.originalname.split('.')[0]}.${file.originalname
            .split('.')[1]
            .toLowerCase()}`;
        let existD = documents_1.default.docs.findIndex((e) => e === fileN);
        if (existD === -1) {
            documents_1.default.addDocument(fileN);
            cb(null, fileN);
        }
        else {
            cb(null, null);
        }
    }
});
const socket = __importStar(require("../sockets/socket"));
const caseRts_1 = __importDefault(require("../routes/caseRts"));
const documents_1 = __importDefault(require("../helpers/documents"));
const emailRts_1 = __importDefault(require("../routes/emailRts"));
const evidenceRts_1 = __importDefault(require("../routes/evidenceRts"));
const loginRts_1 = __importDefault(require("../routes/loginRts"));
const noteRts_1 = __importDefault(require("../routes/noteRts"));
const notificationRts_1 = __importDefault(require("../routes/notificationRts"));
const postRts_1 = __importDefault(require("../routes/postRts"));
const postAnalyticsRts_1 = __importDefault(require("../routes/postAnalyticsRts"));
const trackingRts_1 = __importDefault(require("../routes/trackingRts"));
const userRts_1 = __importDefault(require("../routes/userRts"));
const volumeRts_1 = __importDefault(require("../routes/volumeRts"));
const whatsappRts_1 = __importDefault(require("../routes/whatsappRts"));
const chatRts_1 = __importDefault(require("../routes/chatRts"));
const contactRts_1 = __importDefault(require("../routes/contactRts"));
const practiceAreaRts_1 = __importDefault(require("../routes/practiceAreaRts"));
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
        this.app.use(multer({
            storage,
            fileFilter: (req, file, cb) => {
                console.log(file);
                let validExtensions = ['doc', 'docx', 'pdf', 'jpg', 'png', 'gif'];
                let extension = path_1.extname(file.originalname)
                    .split('.')[1]
                    .toLowerCase();
                if (validExtensions.indexOf(extension) < 0) {
                    return cb(new Error('Only pdfs are allowed'));
                }
                cb(null, true);
            }
        }).array('evidences'));
        this.app.use(express_1.default.json({ limit: '20mb' }));
        this.app.use(express_1.default.urlencoded({ extended: false, limit: '20mb' }));
        // this.app.use(express.static(join(__dirname, '../public'))
        // );
        // console.log(join(__dirname, '../public'));
        this.app.use('/ftp', express_1.default.static(path_1.join(__dirname, '../public')), serveIndex(path_1.join(__dirname, '../public'), { icons: true }));
    }
    listenSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', (cliente) => {
            // Start Socket Conection To Listen To Case Events
            socket.caseEvents(cliente, this.io);
            // Store Connected Clients IDs When Socket Connection Is Established
            socket.configClientConnected(cliente);
            // Start Socket Conection To Listen To New Clients Connected
            socket.connectClient(cliente);
            // Start Socket Conection To Listen When A User Is Updated Or Registered
            socket.notification(cliente, this.io);
            // Finish Current Socket Conection
            socket.disconnect(cliente);
        });
    }
    routes() {
        this.app.use('/api/cases', caseRts_1.default);
        this.app.use('/api/chat', chatRts_1.default);
        this.app.use('/api/contacts', contactRts_1.default);
        this.app.use('/api/email', emailRts_1.default);
        this.app.use('/api/evidences', evidenceRts_1.default);
        this.app.use('/api/login', loginRts_1.default);
        this.app.use('/api/notes', noteRts_1.default);
        this.app.use('/api/notifications', notificationRts_1.default);
        this.app.use('/api/posts', postRts_1.default);
        this.app.use('/api/postsanalytics', postAnalyticsRts_1.default);
        this.app.use('/api/practice-areas', practiceAreaRts_1.default);
        this.app.use('/api/trackings', trackingRts_1.default);
        this.app.use('/api/users', userRts_1.default);
        this.app.use('/api/volumes', volumeRts_1.default);
        this.app.use('/api/whatsapp', whatsappRts_1.default);
    }
    start() {
        const port = process.env.PORT || 3001;
        this.httpServer.listen(port, () => {
            console.log(`Server On Port: ${port}`);
        });
    }
}
exports.default = Server;
