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
        //     (req: Request, res: Response) => {
        //     this.employeeController.getAllUsers(req, res);
        //     // const employees = db.getQuiz(+req.params.categoryId);
        //     res.status(200).send([]);
        // })
        
        return this.app;
    }
}