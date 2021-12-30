import { NextFunction, Request, Response } from 'express';
import { body, param, validationResult, query } from 'express-validator';
import { EmployeeBody, GetEmployeeByNameQParams } from './employee.routes';

// approach inspired by https://stackoverflow.com/a/61268141/1306679
const employeeValidator = [
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
        // birtHdate and hireDate are optional, so the check will pass if at least one of the two are nullish
        return birthDate == null || hireDate == null || birthDate < hireDate;
      },
    )
    .withMessage('HireDate cannot be before BirthDate'),
  (request: Request<Record<string, any>, unknown, EmployeeBody>, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });
    next();
  },
];

const searchEmployeesByNameValidator = [
  query('firstName').default(''),
  query('lastName').default(''),
  (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });
    next();
  },
]

export { employeeValidator, searchEmployeesByNameValidator };
