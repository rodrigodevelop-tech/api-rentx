import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

class SendForgotPasswordMailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user } = request.body;

    const sendForgotPasswordMailUseCase = container.resolve(
      SendForgotPasswordMailUseCase,
    );

    await sendForgotPasswordMailUseCase.execute(user);

    return response.send();
  }
}

export { SendForgotPasswordMailController };
