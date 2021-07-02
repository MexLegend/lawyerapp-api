import { Router } from 'express';

import whatsappController from '../controllers/whatsappCtrl';

class WhatsappRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', whatsappController.send);
  }
}

const whatsappRoutes = new WhatsappRoutes();
export default whatsappRoutes.router;
