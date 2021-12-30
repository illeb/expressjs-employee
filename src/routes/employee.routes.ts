import { IApplicationRoute } from '../common/IApplicationRoute';
import { Application } from 'express';
import { EmployeeController } from '../data/controllers/employee.controller';

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
    this.app.route(`/employee`).get(this.employeeController.searchEmployeesByName);
    this.app.route(`/employee/:employeeID`).get(this.employeeController.getEmployeeById);

    // point 3
    this.app.route(`/employee`).post(this.employeeController.createEmployee);

    // point 4
    this.app.route(`/employee/:employeeID`).put(this.employeeController.updateEmployee);
    
    // point 5
    this.app.route(`/employee/:employeeID`).delete(this.employeeController.deleteEmployee);

    return this.app;
  }
}