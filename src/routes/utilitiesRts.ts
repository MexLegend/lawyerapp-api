import { Router } from 'express';
import utilitiesController from '../controllers/utilitiesCtrl';
import { AUTH } from '../middlewares/authentication';

class UtilitiesRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/check-token/:token', utilitiesController.checkToken);
    this.router.get('/rate/all/:id', utilitiesController.getAllRateData);
    this.router.get(
      '/rate/one/:id/:user',
      utilitiesController.getRateDataFromOneUser
    );
    this.router.put('/rate', [AUTH.verifyToken], utilitiesController.rateData);
    this.router.put(
      '/rate/update',
      [AUTH.verifyToken],
      utilitiesController.updateRatedData
    );
  }
}

const utilitiesRoutes = new UtilitiesRoutes();
export default utilitiesRoutes.router;
