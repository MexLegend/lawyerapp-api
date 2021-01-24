import { Router } from 'express';

import volumeController from '../controllers/volumeCtrl';
import { AUTH } from '../middlewares/authentication';

class VolumeRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      '/:idCase',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      volumeController.create
    );
    this.router.get('/all/:idCase', [AUTH.verifyToken], volumeController.get);
    this.router.get('/:id', volumeController.getOne);
    this.router.put('/:id', volumeController.update);
    this.router.delete('/temp/:id', volumeController.deleteTemp);
  }
}

const volumeRoutes = new VolumeRoutes();
export default volumeRoutes.router;
