import 'reflect-metadata';
import { createConnection, getCustomRepository } from 'typeorm';
import express from 'express';
import * as http from 'http';
import cors from 'cors';

import { EmployeeRoutes, RootRoutes } from '../src/routes/index';
import { Employee, EmployeeRepository } from './data';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;

app.use(express.json());
app.use(cors());

const routes = [new RootRoutes(app), new EmployeeRoutes(app)];

createConnection().then(async () => {
  await getCustomRepository(EmployeeRepository).save([
    {
      id: 1,
      firstName: 'Tizio',
      lastName: 'Caio',
    },
    {
      id: 2,
      firstName: 'Pinco',
      lastName: 'Pallo',
    },
    {
      id: 3,
      firstName: 'Tiziano',
      lastName: 'Qualunquelli',
    },
  ] as Employee[]);

  server.listen(port, () => {
    routes.forEach((route) => route.addRoutes());
  });
});
