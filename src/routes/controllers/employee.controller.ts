import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from '../../data';
import {
  GetEmployeeByNameQParams,
  GetEmployeeByIdParams,
  EmployeeBody,
  EmployeeDeleteParams,
  EmployeeUpdateParams,
} from '../employee/employee.routes';

const Errors = {
  CANNOT_FIND_EMPLOYEE: (_: TemplateStringsArray, id: number) => `Cannot find employee with the specified ID: ${id}`,
  EMPLOYEE_ALREADY_EXIST: (_: TemplateStringsArray, id: number) => `Employee already exist with the given ID: ${id}`,
};

export class EmployeeController {
  public async getAllEmployees(_: Request, response: Response) {
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.find();

    response.status(200).send(employees);
  }

  public async searchEmployeesByName(
    request: Request<unknown, unknown, unknown, GetEmployeeByNameQParams>,
    response: Response,
  ) {
    const { firstName, lastName } = request.query;
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.findByName(firstName, lastName);

    // we return an array, because we need to manage homonyms
    response.status(200).send(employees);
  }

  public async getEmployeeById(request: Request<GetEmployeeByIdParams>, response: Response) {
    const { employeeID } = request.params;
    const repository = getCustomRepository(EmployeeRepository);

    const employee = await repository.findOne(employeeID);
    if (employee == null) 
      return response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${employeeID}`);
    
    response.status(200).send(employee);
  }

  public async createEmployee(request: Request<Record<string, unknown>, unknown, EmployeeBody>, response: Response) {
    const { employeeID, firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);

    const employeeExists = (await repository.findOne(employeeID)) != null;
    if (employeeExists)
      return response.status(403).send(Errors.EMPLOYEE_ALREADY_EXIST`${employeeID}`);

    const newEmployee = new Employee(employeeID, firstName, lastName, birthDate, hireDate);
    await repository.save(newEmployee);

    response.status(200).send();
  }

  public async updateEmployee(request: Request<EmployeeUpdateParams, unknown, EmployeeBody>, response: Response) {
    const targetEmployeeID = request.params.employeeID;
    const { firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);

    const employeeExists = (await repository.findOne(targetEmployeeID)) != null;
    if (!employeeExists)
      return response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${targetEmployeeID}`);

    const updatedEmployee = new Employee(targetEmployeeID, firstName, lastName, birthDate, hireDate);
    await repository.update(targetEmployeeID, updatedEmployee);

    response.status(200).send();
  }

  public async deleteEmployee(request: Request<EmployeeDeleteParams>, response: Response) {
    const targetEmployeeID = request.params.employeeID;
    const repository = getCustomRepository(EmployeeRepository);

    const employeeExists = (await repository.findOne(targetEmployeeID)) != null;
    if (!employeeExists)
      return response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${targetEmployeeID}`);

    await repository.delete(targetEmployeeID);

    response.status(200).send();
  }
}
