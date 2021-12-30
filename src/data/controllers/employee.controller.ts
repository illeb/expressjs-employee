import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from '..';

export class EmployeeController {

  public async getAllEmployees(_: Request, response: Response) {
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.find();

    response.status(200).send(employees);
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

    const employee = await repository.findOne(employeeID);
    if (employee == null) {
      response.status(404).send('Cannot find employee with the specified ID');
      return;
    }
    response.status(200).send(employee);
  }

  public async createEmployee(request: Request<never, never, EmployeeBody>, response: Response) {
    const { employeeID, firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);

    if (employeeID == null || firstName == null || lastName == null) {
      response.status(400).send(`Requested parameters are missing`);
      return;
    }

    if (hireDate != null && birthDate != null && birthDate > hireDate) {
      response.status(400).send('BirthDate must be lower than hireDate')
      return;
    }
    
    const employeeExists = (await repository.findOne(employeeID)) != null;
    if (employeeExists) {
      response.status(403).send('Employee already exist with the given ID');
      return;
    }

    const newEmployee = new Employee(employeeID, firstName, lastName, birthDate, hireDate);
    await repository.save(newEmployee);
    
    response.status(200).send();
  }

  public async updateEmployee(request: Request<EmployeeUpdateParams, never, EmployeeBody>, response: Response) {
    const targetEmployeeID = request.params.employeeID;
    const { firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);
    
    const employeeExists = (await repository.findOne(targetEmployeeID)) != null;
    if (!employeeExists) {
      response.status(404).send('Cannot find employee with the specified ID');
      return;
    }

    if (targetEmployeeID == null || firstName == null || lastName == null) {
      response.status(400).send(`Requested parameters are missing`);
      return;
    }

    if (hireDate != null && birthDate != null && birthDate > hireDate) {
      response.status(400).send('BirthDate must be lower than hireDate')
      return;
    }

    const updatedEmployee = new Employee(targetEmployeeID, firstName, lastName, birthDate, hireDate);
    await repository.update(targetEmployeeID, updatedEmployee);
    
    response.status(200).send();
  }

  public async deleteEmployee(request: Request<never, never, never, GetEmployeeByNameQParams>, response: Response) {
    const { firstName, lastName } = request.query;
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.findByName(firstName, lastName);
    
    response.status(200).send(employees);
  }
}

interface GetEmployeeByIdParams {
  employeeID: number;
}

interface EmployeeBody {
  employeeID: number;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  hireDate?: Date;
}

interface EmployeeUpdateParams {
  employeeID: number;
}

interface GetEmployeeByNameQParams {
  firstName: string;
  lastName: string;
}