import { AppError } from '../../../../shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { Rental } from '../../infra/typeorm/entities/Rental';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const MINIMUM_DAILY = 1;
    console.log(id);

    const rental = await this.rentalsRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental does not exists!');
    }

    const car = await this.carsRepository.findById(rental.car_id);

    // verificar tempo de aluguel
    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);

    if (daily <= 0) {
      daily = MINIMUM_DAILY;
    }

    const delayDays = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date,
    );

    let total = 0;

    if (delayDays > 0) {
      const calculate_fine = delayDays * car.fine_amount;
      total = calculate_fine;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
