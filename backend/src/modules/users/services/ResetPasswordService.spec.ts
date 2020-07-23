import 'reflect-metadata'

import ResetPasswordService from '@modules/users/services/ResetPasswordService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokenRepository
let fakeHashProvider: FakeHashProvider
let resetPassword: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokenRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    })

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const { token } = await fakeUserTokensRepository.generate(user.id)

    await resetPassword.execute({
      password: '123123',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    )

    await expect(
      resetPassword.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password after two hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '123456',
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
