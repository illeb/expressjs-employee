import { IApplicationRoute } from '../../common/IApplicationRoute';
import { Application, Request, Response } from 'express';

export class RootRoutes implements IApplicationRoute {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  addRoutes(): Application {
    const runningMessage = `Server working as expected.`;
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send(runningMessage);
    });

    return this.app;
  }
}
