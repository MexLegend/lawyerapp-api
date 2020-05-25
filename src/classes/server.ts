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
    cb(null, file.originalname);
  }
});

import * as socket from '../sockets/socket';

import emailRoutes from '../routes/emailRts';
import fileRoutes from '../routes/fileRts';
import loginRoutes from '../routes/loginRts';
import notificationRoutes from '../routes/notificationRts';
import postRoutes from '../routes/postRts';
import trackingRoutes from '../routes/trackingRts';
import userRoutes from '../routes/userRts';
import whatsappRoutes from '../routes/whatsappRts';

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
          let validExtensions = ['doc', 'docx', 'pdf'];
          // console.log(extname(file.originalname).split('.')[1]);

          let extension = extname(file.originalname).split('.')[1];

          if (validExtensions.indexOf(extension) < 0) {
            return cb(new Error('Only pdfs are allowed'));
          }

          cb(null, true);
        }
      }).array('files')
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

  routes(): void {
    this.app.use('/api/posts', postRoutes);
    this.app.use('/api/email', emailRoutes);
    this.app.use('/api/files', fileRoutes);
    this.app.use('/api/login', loginRoutes);
    this.app.use('/api/notifications', notificationRoutes);
    this.app.use('/api/tracking', trackingRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/whatsapp', whatsappRoutes);
  }

  private listenSockets() {
    console.log('Escuchando conexiones - sockets');
    this.io.on('connection', (cliente: any) => {
      socket.existUser(cliente, this.io);

      socket.notification(cliente, this.io);

      socket.disconnect(cliente);
    });
  }

  start(): void {
    const port = process.env.PORT || 3000;
    this.httpServer.listen(port, () => {
      console.log(`Server On Port: ${port}`);
    });
  }
}
