import { Router } from 'express';

import fileController from '../controllers/fileCtrl';
import { AUTH } from '../middlewares/authentication';

class FileRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      '/',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      fileController.create
    );
    this.router.get('/', [AUTH.verifyToken], fileController.get);
    this.router.get('/all/:idClient', [AUTH.verifyToken], fileController.getAll);
    this.router.get('/:id', fileController.getOne);
    this.router.put('/:id', fileController.update);
    this.router.put('/upload/file', fileController.upload);
    this.router.delete('/:id', fileController.delete);
  }
}

const fileRoutes = new FileRoutes();
export default fileRoutes.router;
