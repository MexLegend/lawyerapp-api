import { Router } from 'express';
import { AUTH } from '../middlewares/authentication';
import contactController from '../controllers/contactCtrl';

class ContactRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', [AUTH.verifyToken], contactController.create);
    this.router.get('/:id', [AUTH.verifyToken], contactController.getAll);
    this.router.get('/one/:id', [AUTH.verifyToken], contactController.getOne);
    this.router.put('/:id', [AUTH.verifyToken], contactController.update);
    this.router.delete('/:id', [AUTH.verifyToken], contactController.delete);
  }
}

const contactRoutes = new ContactRoutes();
export default contactRoutes.router;
