import { Router } from 'express';

import trackingController from '../controllers/trackingCtrl';
import { AUTH } from '../middlewares/authentication';

class TrackingRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.delete('/:id', trackingController.delete);
    this.router.delete('/:id/doc/:idDoc', trackingController.deleteDoc);
    this.router.get('/:id', trackingController.get);
    this.router.get(
      '/lawyer/all',
      [AUTH.verifyToken],
      trackingController.getByLowyer
    );
    this.router.post(
      '/:id',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      trackingController.create
    );
    this.router.put('/:id', trackingController.update);
  }
}

const trackingRoutes = new TrackingRoutes();
export default trackingRoutes.router;
