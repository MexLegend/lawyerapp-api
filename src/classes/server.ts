import cors from 'cors';
import express, { Application, response } from 'express';
import http from 'http';
import socketIO from 'socket.io';
import { extname, join } from 'path';

const multer = require('multer');
const serveIndex = require('serve-index');
const storage = multer.diskStorage({
  destination: join(__dirname, '../public/uploads'),
  filename: (req: any, file: any, cb: any) => {
    let fileN = `${file.originalname.split('.')[0]}.${file.originalname
      .split('.')[1]
      .toLowerCase()}`;

    let existD = documents.docs.findIndex((e: any) => e === fileN);

    if (existD === -1) {
      documents.addDocument(fileN);
      cb(null, fileN);
    } else {
      cb(null, null);
    }
  }
});

import * as socket from '../sockets/socket';

import caseRoutes from '../routes/caseRts';
import documents from '../helpers/documents';
import emailRoutes from '../routes/emailRts';
import evidenceRoutes from '../routes/evidenceRts';
import loginRoutes from '../routes/loginRts';
import noteRoutes from '../routes/noteRts';
import notificationRoutes from '../routes/notificationRts';
import postRoutes from '../routes/postRts';
import postAnalyticsRoutes from '../routes/postAnalyticsRts';
import trackingRoutes from '../routes/trackingRts';
import userRoutes from '../routes/userRts';
import volumeRoutes from '../routes/volumeRts';
import whatsappRoutes from '../routes/whatsappRts';
import chatRoutes from '../routes/chatRts';
import contactRoutes from '../routes/contactRts';
import practiceAreaRoutes from '../routes/practiceAreaRts';

export default class Server {
  private static _instance: Server;
  public app: Application;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.config();
    this.routes();

    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);
    this.listenSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  config(): void {
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(
      multer({
        storage,
        fileFilter: (req: any, file: any, cb: any) => {
          console.log(file);

          let validExtensions = ['doc', 'docx', 'pdf', 'jpg', 'png', 'gif'];

          let extension = extname(file.originalname)
            .split('.')[1]
            .toLowerCase();

          if (validExtensions.indexOf(extension) < 0) {
            return cb(new Error('Only pdfs are allowed'));
          }

          cb(null, true);
        }
      }).array('evidences')
    );
    this.app.use(express.json({ limit: '20mb' }));
    this.app.use(express.urlencoded({ extended: false, limit: '20mb' }));
    // this.app.use(express.static(join(__dirname, '../public'))
    // );
    // console.log(join(__dirname, '../public'));
    this.app.use(
      '/ftp',
      express.static(join(__dirname, '../public')),
      serveIndex(join(__dirname, '../public'), { icons: true })
    );
  }

  private listenSockets() {
    console.log('Escuchando conexiones - sockets');
    this.io.on('connection', (cliente: any) => {
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

  routes(): void {
    this.app.use('/api/cases', caseRoutes);
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/contacts', contactRoutes);
    this.app.use('/api/email', emailRoutes);
    this.app.use('/api/evidences', evidenceRoutes);
    this.app.use('/api/login', loginRoutes);
    this.app.use('/api/notes', noteRoutes);
    this.app.use('/api/notifications', notificationRoutes);
    this.app.use('/api/posts', postRoutes);
    this.app.use('/api/postsanalytics', postAnalyticsRoutes);
    this.app.use('/api/practice-areas', practiceAreaRoutes);
    this.app.use('/api/trackings', trackingRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/volumes', volumeRoutes);
    this.app.use('/api/whatsapp', whatsappRoutes);
  }

  start(): void {
    const port = process.env.PORT || 3001;
    this.httpServer.listen(port, () => {
      console.log(`Server On Port: ${port}`);
    });
  }
}
