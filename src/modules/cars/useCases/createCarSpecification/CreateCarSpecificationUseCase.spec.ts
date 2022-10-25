import { AppError } from './../../../../shared/errors/AppError';
import { CarsRepositoryInMemory } from '../../repositories/in-memory/CarsRepositoryInMemory';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';
import { SpecificationsRepositoryInMemory } from '../../repositories/in-memory/SpecificationsRepositoryInMemory';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('Should not be able to add a new specification to a now-existent car', async () => {
    expect(async () => {
      const car_id = '1234';
      const specifications_id = ['2322'];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      id: '1',
      name: 'Car_test',
      brand: 'brand_test',
      category_id: 'category_id',
      description: 'description_id',
      daily_rate: 110,
      fine_amount: 14,
      license_plate: '123-AAAA',
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'specification_name',
      description: 'specification_description',
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
