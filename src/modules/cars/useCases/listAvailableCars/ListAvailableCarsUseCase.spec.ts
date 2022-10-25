import { CarsRepositoryInMemory } from '../../repositories/in-memory/CarsRepositoryInMemory';
import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it('Should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 1',
      brand: 'Car description',
      category_id: 'category_id',
      daily_rate: 110.0,
      description: 'Carro espaçoso',
      fine_amount: 40,
      license_plate: '000-000',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Car description',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      brand: 'Car description',
      category_id: 'category_id',
      daily_rate: 110.0,
      description: 'Carro espaçoso',
      fine_amount: 40,
      license_plate: '000-000',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car2',
    });

    expect(cars).toEqual([car]);
  });

  it('Should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car2',
      brand: 'Car description',
      category_id: 'category_id3',
      daily_rate: 110.0,
      description: 'Carro espaçoso',
      fine_amount: 40,
      license_plate: '000-000',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: 'category_id3',
    });

    expect(cars).toEqual([car]);
  });
});
