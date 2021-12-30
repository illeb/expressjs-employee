import { LoginBody } from '../auth/auth.routes';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const valid_logins = [
  {
    username: 'foo',
    password: 'foobar123',
  },
  {
    username: 'bar',
    password: 'foobar456',
  },
];

const Errors = {
  INVALID_CREDENTIALS: `Sorry, invalid credentials`,
};

export class AuthController {
  public async checkLogin(request: Request<Record<string, unknown>, unknown, LoginBody>, response: Response) {
    const { username, password } = request.body;

    if (!valid_logins.some((login) => username === login.username && password === login.password))
      return response.status(400).send(Errors.INVALID_CREDENTIALS);

    const token = jwt.sign(
      {
        username,
      },
      'PRIVATE_KEY',
      { expiresIn: '1y', issuer: 'Stefano Belli', subject: username },
    );

    response.status(200).send(token);
  }
}
