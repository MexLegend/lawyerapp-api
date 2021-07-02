import { Router } from 'express';

import { AUTH } from '../middlewares/authentication';
import practiceAreaController from '../controllers/practiceAreaCtrl';

class PracticeAreaRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      '/',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      practiceAreaController.create
    );
    this.router.get('/', practiceAreaController.get);
    this.router.get('/:idPracticeArea', practiceAreaController.getOne);
    this.router.get(
      '/specialized-lawyers/:idPracticeArea',
      practiceAreaController.getSpecializedLawyers
    );
    this.router.put(
      '/:idPracticeArea',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.update
    );
    this.router.put(
      '/specialized-lawyer/',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.updateSpecializedLawyer
    );
    this.router.put(
      '/specialized-lawyer/:idPracticeArea',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.deleteSpecializedLawyer
    );
    this.router.put(
      '/updateStatus/:idPracticeArea',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.updateState
    );
    this.router.delete(
      '/completly/:idPracticeArea',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.deleteCompletly
    );
    this.router.delete(
      '/temporary/:idPracticeArea',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      practiceAreaController.deleteTemporary
    );
  }
}

const practiceAreaRoutes = new PracticeAreaRoutes();
export default practiceAreaRoutes.router;
