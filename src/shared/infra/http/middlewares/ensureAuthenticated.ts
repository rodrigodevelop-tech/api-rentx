import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../errors/AppError';
import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(
      token,
      'b65bce1059c747307dc0146629265456',
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const userExists = await usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('User does not exists!', 401);
    }

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError('Invalid Token', 401);
  }
}
