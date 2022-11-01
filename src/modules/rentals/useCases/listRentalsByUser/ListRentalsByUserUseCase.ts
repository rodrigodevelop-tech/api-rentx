import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/errors/AppError';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListRentalsByUserUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<Rental[]> {
    try {
      const rentalsByUser = await this.rentalsRepository.findByUserId(user_id);
      return rentalsByUser;
    } catch (err) {
      throw new AppError('Error in find by user id!', 500);
    }
  }
}

export { ListRentalsByUserUseCase };
