import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from '..';
import { GetEmployeeByNameQParams, GetEmployeeByIdParams, EmployeeBody, EmployeeDeleteParams } from '../../../src/routes/employee.routes';

const Errors = {
  CANNOT_FIND_EMPLOYEE: (_: TemplateStringsArray, id: number) => `Cannot find employee with the specified ID: ${id}`,
  EMPLOYEE_ALREADY_EXIST: (_: TemplateStringsArray, id: number) => `Employee already exist with the given ID: ${id}`
};

export class EmployeeController {

  public async getAllEmployees(_: Request, response: Response) {
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.find();

    response.status(200).send(employees);
  }

  public async searchEmployeesByName(request: Request<unknown, unknown, unknown, GetEmployeeByNameQParams>, response: Response) {
    const { firstName, lastName } = request.query;
    const repository = getCustomRepository(EmployeeRepository);

    const employees = await repository.findByName(firstName, lastName);
    
    response.status(200).send(employees);
  }

  public async getEmployeeById(request: Request<GetEmployeeByIdParams>, response: Response) {
    const { employeeID } = request.params;
    const repository = getCustomRepository(EmployeeRepository);

    const employee = await repository.findOne(employeeID);
    if (employee == null) {
      response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${employeeID}`);
      return;
    }
    response.status(200).send(employee);
  }

  public async createEmployee(request: Request<unknown, unknown, EmployeeBody>, response: Response) {
    const { employeeID, firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);
    
    const employeeExists = (await repository.findOne(employeeID)) != null;
    if (employeeExists) {
      response.status(403).send(Errors.EMPLOYEE_ALREADY_EXIST`${employeeID}`);
      return;
    }

    const newEmployee = new Employee(employeeID, firstName, lastName, birthDate, hireDate);
    await repository.save(newEmployee);
    
    response.status(200).send();
  }

  public async updateEmployee(request: Request<any, never, EmployeeBody>, response: Response) {
    const targetEmployeeID = request.params.employeeID;
    const { firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);
    
    const employeeExists = (await repository.findOne(targetEmployeeID)) != null;
    if (!employeeExists) {
      response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${targetEmployeeID}`);
      return;
    }

    const updatedEmployee = new Employee(targetEmployeeID, firstName, lastName, birthDate, hireDate);
    await repository.update(targetEmployeeID, updatedEmployee);
    
    response.status(200).send();
  }

  public async deleteEmployee(request: Request<EmployeeDeleteParams>, response: Response) {
    const targetEmployeeID = request.params.employeeID;
    const repository = getCustomRepository(EmployeeRepository);

    const employeeExists = (await repository.findOne(targetEmployeeID)) != null;
    if (!employeeExists) {
      response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${targetEmployeeID}`);
      return;
    }

    await repository.delete(targetEmployeeID)
        
    response.status(200).send();
  }
}