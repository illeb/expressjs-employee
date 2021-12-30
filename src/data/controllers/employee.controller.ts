import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from '..';

export class EmployeeController {

  public async getAllEmployees(_: Request, response: Response) {
    const repository = getCustomRepository(EmployeeRepository);
    return repository.find()
      .then((employee) => response.status(200).send(employee))
      .catch((error) => response.status(500).send({error: error}));
  }

  public async searchEmployeesByName(request: Request<never, never, never, GetEmployeeByNameQParams>, response: Response) {
    const { firstName, lastName } = request.query;
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.findByName(firstName, lastName);
    
    response.status(200).send(employees);
  }

  public async getEmployeeById(request: Request<GetEmployeeByIdParams, never >, response: Response) {
    const { employeeID } = request.params;
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.findByIds([employeeID]);
    if(employees.length)
      response.status(200).send(employees);
    else
      response.status(404).send('Cannot find employee with the specified ID');
  }

  public async createEmployee(request: Request<never, never, Employee>, response: Response) {
    const { id, firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);

    if (id == null || firstName == null || lastName) {
      response.status(400).send(`Requested parameters are missing`);
    }
    if (hireDate != null && birthDate != null && birthDate > hireDate) {
      
    }

    const employees = await repository.save(employee);
    
    response.status(200).send(employees);
  }

  // public async updateEmployee(request: Request<never, never, GetEmployeeByNameQParams>, response: Response) {
  //   // request.body
  //   const repository = getCustomRepository(EmployeeRepository);

  //   const employees = await repository.findByName(firstName, lastName);
    
  //   response.status(200).send(employees);
  //     // .catch((error) => response.status(500).send({error: error}));
  // }

  // public async deleteEmployee(request: Request<never, never, never, GetEmployeeByNameQParams>, response: Response) {
  //   const { firstName, lastName } = request.query;
  //   const repository = getCustomRepository(EmployeeRepository);

  //   const employees = await repository.findByName(firstName, lastName);
    
  //   response.status(200).send(employees);
  //     // .catch((error) => response.status(500).send({error: error}));
  // }
}

interface GetEmployeeByIdParams {
  employeeID: number;
}

interface CreateEmployeeBody {
  employeeID: number;
}

interface GetEmployeeByNameQParams {
  firstName: string;
  lastName: string;
}