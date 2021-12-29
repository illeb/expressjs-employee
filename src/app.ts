import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import * as http from 'http';
import cors from 'cors';

import { EmployeeRoutes, RootRoutes } from './routes';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;

app.use(express.json());
app.use(cors());

const routes = [
  new RootRoutes(app),
  new EmployeeRoutes(app)
];

createConnection().then(() => {
  server.listen(port, () => {
    routes.forEach(route => route.addRoutes());
  });
});