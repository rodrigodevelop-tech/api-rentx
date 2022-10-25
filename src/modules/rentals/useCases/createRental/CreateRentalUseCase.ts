import { inject, injectable } from 'tsyringe';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { AppError } from './../../../../shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

// @injectable()
class CreateRentalUseCase {
  constructor(
    // @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
  ) {}

  async execute({ car_id, user_id, expected_return_date }: IRequest): Promise<Rental> {
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id);

    if (carUnavailable) {
      throw new AppError('Car is unavailable');
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToUser) {
      throw new AppError("There's a rental is progress for user!");
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
