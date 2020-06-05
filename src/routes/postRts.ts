import { Router } from 'express';

import postController from '../controllers/postCtrl';
import { AUTH } from '../middlewares/authentication';

class PostRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.post('/', [AUTH.verifyToken, AUTH.verifyAdmin], postController.create);
        this.router.get('/', postController.get );
        this.router.get(
            '/:id',
            postController.getOne
        );
        this.router.put(
            '/:id',
            postController.update
        );
        this.router.delete('/:id', postController.delete);
    }
}

const postRoutes = new PostRoutes();
export default postRoutes.router;
