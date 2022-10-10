import { Category } from '../../entities/Category';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListCategoriesUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(): Promise<Category[]> {
    const categoriesAll = await this.categoriesRepository.list();

    return categoriesAll;
  }
}

export { ListCategoriesUseCase };
