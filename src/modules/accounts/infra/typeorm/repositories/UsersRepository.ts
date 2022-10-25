import { Repository, getRepository } from 'typeorm';
import { ICreateUserDTO } from '../../../DTOs/ICreateUserDTO';
import { IUsersRepository } from '../../../repositories/IUsersRepository';
import { User } from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    id,
    name,
    email,
    password,
    driver_license,
    avatar,
  }: ICreateUserDTO): Promise<void> {
    const userCreated = this.repository.create({
      id,
      name,
      email,
      password,
      driver_license,
      avatar,
    });

    await this.repository.save(userCreated);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });

    return user;
  }

  async findById(user_id: string): Promise<User> {
    const user = await this.repository.findOne({ id: user_id });

    return user;
  }
}

export { UsersRepository };
