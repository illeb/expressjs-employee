import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const AuthValidator = () => {
  return [
    body('username', 'Mandatory parameter is missing: username').notEmpty(),
    body('password', 'Mandatory parameter is missing: password').notEmpty(),
    (request: Request, response: Response, next: NextFunction) => {
      const errors = validationResult(request as Request);
      if (!errors.isEmpty()) return response.status(400).json({ errors: errors.array() });
      next();
    },
  ];
};
export { AuthValidator };
