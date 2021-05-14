import { Router } from 'express';

import userController from '../controllers/userCtrl';
import { AUTH } from '../middlewares/authentication';

class UserRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', userController.create);
    this.router.post('/check/email', userController.checkEmail);
    this.router.post(
      '/validate-email-exists',
      userController.validateEmailExists
    );
    this.router.get('/', [AUTH.verifyToken], userController.get);
    this.router.get('/lawyers', userController.getLawyers);
    this.router.get('/lawyer/:id', userController.getLawyer);
    this.router.get('/:id', [AUTH.verifyToken], userController.getOne);
    this.router.put('/:id', [AUTH.verifyToken], userController.update);
    this.router.put(
      '/user-data/:id',
      [AUTH.verifyToken],
      userController.updateUserData
    );

    this.router.put(
      '/image/:id',
      [AUTH.verifyToken, AUTH.verifyAdminSameUser],
      userController.updateImage
    );

    this.router.put(
      '/change-pass/:id',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      userController.updatePass
    );
    this.router.put(
      '/change-pass-directly/:id',
      userController.updatePassDirectly
    );
    this.router.put(
      '/rol/:id',
      [AUTH.verifyToken, AUTH.verifyAdmin],
      userController.updateRol
    );
    this.router.delete(
      '/:id',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      userController.delete
    );
  }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
