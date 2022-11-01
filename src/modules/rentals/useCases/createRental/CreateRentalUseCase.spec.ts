import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { AppError } from './../../../../shared/errors/AppError';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';
import { CarsRepositoryInMemory } from '../../../cars/repositories/in-memory/CarsRepositoryInMemory';

dayjs.extend(utc);

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create Rental', () => {
  const dayAdd25Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('Should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Test',
      description: 'Car test',
      daily_rate: 100,
      license_plate: '000-XXX',
      brand: 'brand test',
      fine_amount: 40,
      category_id: 'category_id',
    });

    const rental = await createRentalUseCase.execute({
      user_id: 'user123',
      car_id: car.id,
      expected_return_date: dayAdd25Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('expected_return_date');
  });

  it('Should be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      user_id: 'user123',
      car_id: '111',
      expected_return_date: dayAdd25Hours,
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user123',
        car_id: '13123123',
        expected_return_date: dayAdd25Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      user_id: 'user123',
      car_id: '111',
      expected_return_date: dayAdd25Hours,
    });

    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user321',
        car_id: '111',
        expected_return_date: dayAdd25Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to create a new rental with invalid return time', async () => {
    await expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user123',
        car_id: 'car123',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
