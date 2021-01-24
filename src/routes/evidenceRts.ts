import { Router } from 'express';

import evidenceController from '../controllers/evidenceCtrl';
import { AUTH } from '../middlewares/authentication';

class EvidenceRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/:idCase', [AUTH.verifyToken], evidenceController.create);
    this.router.get('/all/:idCase', [AUTH.verifyToken], evidenceController.get);
    this.router.get('/:idCase', [AUTH.verifyToken], evidenceController.getOne);
    this.router.put(
      '/:idCase/:idEvidence',
      [AUTH.verifyToken],
      evidenceController.update
    );
    this.router.put(
      '/status/:idCase/:idEvidence',
      [AUTH.verifyToken],
      evidenceController.changeTemp
    );
    this.router.delete(
      '/temp/:idCase/:idEvidence',
      [AUTH.verifyToken],
      evidenceController.changeTemp
    );
  }
}

const evidenceRoutes = new EvidenceRoutes();
export default evidenceRoutes.router;
