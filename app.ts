import express from 'express';
import * as http from 'http';


import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
// import * as db from './database';
// import { CategoriesRoutes } from './controller/categories/categories.routes.config';
// import { QuizRoutes } from './controller/quiz/quiz.routes.config';
// import { ParserRoutes } from './controller/parser/parser.routes.config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
// const routes: Array<CommonRoutesConfig> = [];

// db.init();

app.use(express.json());
app.use(cors());

// routes.push(new QuizRoutes(app));

// // this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});


server.listen(port, () => {
//   routes.forEach((route: CommonRoutesConfig) => {
//       debugLog(`Routes configured for ${route.getName()}`);
//   });
  console.log(runningMessage);
});