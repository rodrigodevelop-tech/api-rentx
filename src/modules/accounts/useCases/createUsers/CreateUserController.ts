import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

interface IRequestBody {
  name: string;
  username: string;
  email: string;
  password: string;
  driver_license: string;
}

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driver_license } = request.body as IRequestBody;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license,
    });

    return response.status(201).send();
  }
}

export { CreateUserController };
