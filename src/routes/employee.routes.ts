import { IApplicationRoute } from '../common/IApplicationRoute';
import { Application } from 'express';
import { EmployeeController } from '../data/controllers/employee.controller';
import { EmployeeValidators  } from '../../src/common/employeee.validator';

export class EmployeeRoutes implements IApplicationRoute {
  app: Application;
  employeeController: EmployeeController;
  
  constructor(app: Application) { 
    this.app = app;
    this.employeeController = new EmployeeController();
  }
  
  addRoutes(): Application {
    // point 1
    this.app.route(`/employees`).get(this.employeeController.getAllEmployees);

    // point 2
    this.app.route(`/employee`).get<unknown, unknown, unknown, GetEmployeeByNameQParams>(this.employeeController.searchEmployeesByName);
    this.app.route(`/employee/:employeeID`).get<GetEmployeeByIdParams>(this.employeeController.getEmployeeById);

    // point 3
    this.app.route(`/employee`).post<Record<string, unknown>, unknown, EmployeeBody>(EmployeeValidators(), this.employeeController.createEmployee);

    // point 4
    this.app.route(`/employee/:employeeID`).put<EmployeeUpdateParams, unknown, EmployeeBody>(EmployeeValidators(), this.employeeController.updateEmployee);
    
    // point 5
    this.app.route(`/employee/:employeeID`).delete<EmployeeDeleteParams>(this.employeeController.deleteEmployee);

    return this.app;
  }
}

export interface GetEmployeeByIdParams {
  employeeID: number;
}

export interface EmployeeBody {
  employeeID: number;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  hireDate?: Date;
}

export interface EmployeeUpdateParams {
  employeeID: number;
}

export interface EmployeeDeleteParams {
  employeeID: number;
}

export interface GetEmployeeByNameQParams {
  firstName: string;
  lastName: string;
}