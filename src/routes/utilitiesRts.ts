import { Router } from 'express';
import utilitiesController from '../controllers/utilitiesCtrl';

class UtilitiesRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/check-token/:token', utilitiesController.checkToken);
  }
}

const utilitiesRoutes = new UtilitiesRoutes();
export default utilitiesRoutes.router;
