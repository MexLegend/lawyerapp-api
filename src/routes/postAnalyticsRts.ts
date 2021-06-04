import { Router } from 'express';

import postAnalyticsController from '../controllers/postAnalyticsCtrl';
import { AUTH } from '../middlewares/authentication';

class PostAnalyticsRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/', postAnalyticsController.get);
    this.router.get('/:idArray', postAnalyticsController.getOne);
    this.router.put(
      '/postComment/:idPost',
      [AUTH.verifyToken],
      postAnalyticsController.postComment
    );
    this.router.put(
      '/update/:idPost',
      [AUTH.verifyToken],
      postAnalyticsController.update
    );
  }
}

const postAnalyticsRoutes = new PostAnalyticsRoutes();
export default postAnalyticsRoutes.router;
