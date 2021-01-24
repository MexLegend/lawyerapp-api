import { Router } from 'express';

import trackingController from '../controllers/trackingCtrl';
import { AUTH } from '../middlewares/authentication';

class TrackingRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      '/:idVolume',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      trackingController.create
    );
    this.router.get('/all/:idVolume', trackingController.get);
    this.router.get(
      '/client/:idCase/:idClient',
      [AUTH.verifyToken],
      trackingController.getByClient
    );
    this.router.get(
      '/lawyer/all',
      [AUTH.verifyToken],
      trackingController.getByLowyer
    );
    this.router.get('/:id', trackingController.getOne);
    this.router.put('/:idTracking', trackingController.update);
    this.router.put('/status/:idTrack', trackingController.changeTemp);
    this.router.delete('/:id', trackingController.delete);
    this.router.delete('/:id/doc/:idDoc', trackingController.deleteDoc);
  }
}

const trackingRoutes = new TrackingRoutes();
export default trackingRoutes.router;
