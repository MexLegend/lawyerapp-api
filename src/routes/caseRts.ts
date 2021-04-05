import { Router } from 'express';

import caseController from '../controllers/caseCtrl';
import { AUTH } from '../middlewares/authentication';

class CaseRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', [AUTH.verifyToken], caseController.create);
    this.router.get('/', [AUTH.verifyToken], caseController.get);
    this.router.get(
      '/all/:idClient',
      [AUTH.verifyToken],
      caseController.getAll
    );
    this.router.get('/:id', caseController.getOne);
    this.router.put('/:id', caseController.update);
    this.router.put('/updateStatus/:id', caseController.updateStatus);
    this.router.delete('/temp/:id', caseController.deleteTemp);
  }
}

const caseRoutes = new CaseRoutes();
export default caseRoutes.router;
