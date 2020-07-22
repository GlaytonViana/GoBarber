import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokenRepository;
let sendForgotEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokenRepository();

    sendForgotEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '1234',
    });

    await sendForgotEmailService.execute({
      email: user.email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-exiting user password', async () => {
    await expect(
      sendForgotEmailService.execute({
        email: 'john@mail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '1234',
    });

    await sendForgotEmailService.execute({
      email: user.email,
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
