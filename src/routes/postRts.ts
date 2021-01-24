import { Router } from 'express';

import postController from '../controllers/postCtrl';
import { AUTH } from '../middlewares/authentication';

class PostRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post(
      '/',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      postController.create
    );
    this.router.get('/', postController.get);
    this.router.get(
      '/byRol/',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      postController.getByRol
    );
    this.router.get('/:id', postController.getOne);
    this.router.put(
      '/:id',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      postController.update
    );
    this.router.put('/updateState/:id', postController.updateState);
    this.router.delete(
      '/:id',
      [AUTH.verifyToken, AUTH.verifyAdminAssociated],
      postController.delete
    );
  }
}

const postRoutes = new PostRoutes();
export default postRoutes.router;
