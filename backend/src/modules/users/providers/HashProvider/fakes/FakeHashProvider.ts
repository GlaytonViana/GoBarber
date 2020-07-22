import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public generateHash(payload: string): Promise<string> {
    return new Promise((resolve, _) => {
      resolve(payload);
    });
  }

  public compareHash(payload: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, _) => {
      resolve(payload === hashed);
    });
  }
}
