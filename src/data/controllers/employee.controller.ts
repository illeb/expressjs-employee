import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { Employee, EmployeeRepository } from '..';

const Errors = {
  CANNOT_FIND_EMPLOYEE: (_: TemplateStringsArray, id: number) => `Cannot find employee with the specified ID: ${id}`,
  EMPLOYEE_ALREADY_EXIST: (_: TemplateStringsArray, id: number) => `Employee already exist with the given ID: ${id}`,
  MISSING_PARAMETERS: () => `Requested parameters are missing`,
  HIREDATE_LOWER_BIRTHDATE: () => `BirthDate must be lower than HireDate`,
};

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

  public async createEmployee(request: Request<never, never, EmployeeBody>, response: Response) {
    const { employeeID, firstName, lastName, hireDate, birthDate } = request.body;
    const repository = getCustomRepository(EmployeeRepository);

    if (employeeID == null || firstName == null || lastName == null) {
      response.status(400).send(Errors.MISSING_PARAMETERS);
      return;
    }

    if (hireDate != null && birthDate != null && hireDate < birthDate) {
      response.status(400).send(Errors.HIREDATE_LOWER_BIRTHDATE)
      return;
    }
    
    const employeeExists = (await repository.findOne(employeeID)) != null;
    if (employeeExists) {
      response.status(403).send(Errors.EMPLOYEE_ALREADY_EXIST`${employeeID}`);
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
      response.status(404).send(Errors.CANNOT_FIND_EMPLOYEE`${targetEmployeeID}`);
      return;
    }

    if (targetEmployeeID == null || firstName == null || lastName == null) {
      response.status(400).send(Errors.MISSING_PARAMETERS);
      return;
    }

    if (hireDate != null && birthDate != null && hireDate < birthDate) {
      response.status(400).send(Errors.HIREDATE_LOWER_BIRTHDATE)
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

interface EmployeeDeleteParams {
  employeeID: number;
}

interface GetEmployeeByNameQParams {
  firstName: string;
  lastName: string;
}