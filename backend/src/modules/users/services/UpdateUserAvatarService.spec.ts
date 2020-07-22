import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageAvatar';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

describe('Update user Avatar', () => {
  it('should be able to save avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '12341234',
    });

    const avatarFileName = 'avatar.jpg';

    await updateUserAvatar.execute({
      avatarFileName,
      user_id: user.id,
    });

    expect(user.avatar).toBe(avatarFileName);
  });

  it('should not be able to update avatar if user isn`t existing', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const avatarFileName = 'avatar.jpg';

    await expect(
      updateUserAvatar.execute({
        avatarFileName,
        user_id: 'non-exiting-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@mail.com',
      password: '12341234',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'avatar.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFileName: 'avatar2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
