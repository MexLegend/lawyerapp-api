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
        this.router.get(
            '/',
            [AUTH.verifyToken, AUTH.verifyAdmin],
            userController.get
        );
        this.router.get(
            '/:id', [AUTH.verifyToken, AUTH.verifyAdmin],
            userController.getOne
        );
        this.router.put(
            '/:id', [AUTH.verifyToken, AUTH.verifyAdminSameUser],
            userController.update
        );
        this.router.put(
            '/change-pass/:id', [AUTH.verifyToken, AUTH.verifyAdminSameUser],
            userController.updatePass
        );
        this.router.delete('/:id', [AUTH.verifyToken, AUTH.verifyAdmin], userController.delete);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
