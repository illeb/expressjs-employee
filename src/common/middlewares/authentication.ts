import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EmployeeServer } from '../../app';

const Errors = {
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
};

const CheckToken = async (
  request: Request<unknown, unknown, unknown, unknown>,
  response: Response,
  next: NextFunction,
) => {
  const token = request.headers['authorization']?.toString();

  if (!token) {
    return response.status(401).send(Errors.NOT_AUTHORIZED);
  }
  try {
    jwt.verify(token, EmployeeServer.jwt_key);
  } catch (err) {
    return response.status(401).send(Errors.NOT_AUTHORIZED);
  }
  next();
};
export { CheckToken };
