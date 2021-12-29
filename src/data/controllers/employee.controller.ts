import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { EmployeeRepository } from '..';

export class EmployeeController {
  public async getAllUsers(_: Request, response: Response) {
    const repository = getCustomRepository(EmployeeRepository);
    return repository.find()
      .then((employee) => response.status(200).send(employee))
      .catch((error) => response.status(500).send({error: error}));
  }
}