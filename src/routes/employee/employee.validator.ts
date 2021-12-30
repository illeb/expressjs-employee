import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { EmployeeBody } from './employee.routes';

// approach inspired by https://stackoverflow.com/a/61268141/1306679
const EmployeeValidators = () => {
  return [
    body('employeeID', 'Mandatory parameter is missing: employeeID').if(param('employeeID').isEmpty()).notEmpty(),
    body('firstName', 'Mandatory parameter is missing: firstName').notEmpty(),
    body('lastName', 'Mandatory parameter is missing: lastName').notEmpty(),
    body('birthDate')
      .custom(
        (
          birthDate: Date,
          {
            req: {
              body: { hireDate },
            },
          },
        ) => {
          // birtHdate and hireDate are optional, so the check will pass if one of two (or both) are nullish
          return birthDate == null || hireDate == null || birthDate < hireDate;
        },
      )
      .withMessage('HireDate cannot be before BirthDate'),
    (request: Request<unknown, unknown, EmployeeBody>, response: Response, next: NextFunction) => {
      const errors = validationResult(request as Request);
      if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });
      next();
    },
  ];
};
export { EmployeeValidators };
