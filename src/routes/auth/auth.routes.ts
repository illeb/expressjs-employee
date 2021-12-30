import { IApplicationRoute } from '../../common/IApplicationRoute';
import { Application } from 'express';
import { AuthValidator } from './auth.validator';
import { AuthController } from '../controllers/auth.controller';

export class AuthRoutes implements IApplicationRoute {
  app: Application;
  authController: AuthController;

  constructor(app: Application) {
    this.app = app;
    this.authController = new AuthController();
  }

  addRoutes(): Application {
    // point 3
    this.app
      .route(`/login`)
      .post(
        AuthValidator(),
        this.authController.checkLogin,
      );

    return this.app;
  }
}

export interface LoginBody {
  username: string;
  password: string;
}
