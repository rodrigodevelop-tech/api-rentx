import { AppError } from './../../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUsersTokensRepository } from '../../repositories/IUsersTokensRepository';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new AppError('Token invalid!');
    }

    const dateNow = this.dateProvider.dateNow();

    const dateIsBefore = this.dateProvider.compareIfBefore(
      userToken.expires_date,
      dateNow,
    );

    if (dateIsBefore) {
      throw new AppError('Token expired!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
