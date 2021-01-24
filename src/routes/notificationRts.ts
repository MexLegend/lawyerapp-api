import { Router } from 'express';

import notificationController from '../controllers/notificationCtrl';
import { AUTH } from '../middlewares/authentication';

class NotificationsRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', [AUTH.verifyToken], notificationController.create);
    this.router.get(
      '/userNotifications/:id/:role',
      [AUTH.verifyToken],
      [AUTH.verifyAdminSameUser],
      notificationController.get
    );
    this.router.get('/:id', notificationController.getOne);
    this.router.put('/:id', notificationController.update);
    this.router.delete('/:id', notificationController.delete);
  }
}

const notificationsRoutes = new NotificationsRoutes();
export default notificationsRoutes.router;
