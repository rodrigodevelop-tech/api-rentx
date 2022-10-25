import { AppError } from './../../../../shared/errors/AppError';
import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;

describe('Create Rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('Should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: 'user123',
      car_id: 'car123',
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('expected_return_date');
  });

  it('Should be able to create a new rental if there is another open to the same user', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user123',
        car_id: 'car123',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: 'user123',
        car_id: 'car123',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to create a new rental if there is another open to the same car', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'user123',
        car_id: 'car123',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: 'user321',
        car_id: 'car123',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
