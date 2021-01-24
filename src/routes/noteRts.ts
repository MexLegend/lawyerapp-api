import { Router } from 'express';

import noteController from '../controllers/noteCtrl';
import { AUTH } from '../middlewares/authentication';

class NoteRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/:idCase', [AUTH.verifyToken], noteController.create);
    this.router.get('/all/:id', [AUTH.verifyToken], noteController.get);
    this.router.get('/:id', [AUTH.verifyToken], noteController.getOne);
    this.router.put(
      '/:idCase/:idNote',
      [AUTH.verifyToken],
      noteController.update
    );
    this.router.put(
      '/status/:idCase/:idNote',
      [AUTH.verifyToken],
      noteController.changeTemp
    );
    this.router.delete(
      '/temp/:idCase/:idNote',
      [AUTH.verifyToken],
      noteController.changeTemp
    );
  }
}

const noteRoutes = new NoteRoutes();
export default noteRoutes.router;
