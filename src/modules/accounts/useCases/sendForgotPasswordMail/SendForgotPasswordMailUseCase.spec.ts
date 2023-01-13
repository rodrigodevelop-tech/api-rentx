import { DayjsDateProvider } from "../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "../../../../shared/errors/AppError";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Sedn Forgot Mail', () => {

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('Should be able send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail')

    await usersRepositoryInMemory.create({
      driver_license: '409652',
      email: 'osame@tuzzucwuk.vn',
      name: 'Mark Holland',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('osame@tuzzucwuk.vn');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('bi@jup.us')
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('Should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      driver_license: '612614',
      email: 'newo@gezte.gp',
      name: 'Patrick Warner',
      password: '4321',
    });

    await sendForgotPasswordMailUseCase.execute('newo@gezte.gp');

    expect(generateTokenMail).toBeCalled();
  })
});