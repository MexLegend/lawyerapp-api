import { Router } from 'express';
import emailController from '../controllers/emailCtrl';

class EmailRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/', emailController.send);
    this.router.post(
      '/newsLetter/confirm/:token',
      emailController.newsLetterConfirmed
    );
    this.router.post(
      '/user/confirm/:token',
      emailController.userAccountConfirmed
    );
  }
}

const emailRoutes = new EmailRoutes();
export default emailRoutes.router;
