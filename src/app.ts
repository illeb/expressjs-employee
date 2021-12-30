import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import * as http from 'http';
import cors from 'cors';

import { EmployeeRoutes, RootRoutes } from '../src/routes/index';
import { IApplicationRoute } from './common/IApplicationRoute';
import { AuthRoutes } from './routes/auth/auth.routes';

export class Server {
  app: express.Application;
  server: http.Server;
  port = 3000;
  routes: IApplicationRoute[];

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.routes = [
      new RootRoutes(this.app),
      new EmployeeRoutes(this.app),
      new AuthRoutes(this.app)
    ];
  }

  startServer() {
    this.server = http.createServer(this.app);
    this.server.listen(this.port, () => {
      this.routes.forEach((route) => route.addRoutes());
    });
  }
}

const server = new Server();
createConnection().then(() => server.startServer());