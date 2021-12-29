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
        this.app.route(`/employees`).get(this.employeeController.getAllUsers);        
        return this.app;
    }
}