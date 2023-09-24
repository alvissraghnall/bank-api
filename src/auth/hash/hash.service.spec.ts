import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'password';
      const saltOrRounds = 10;
      const hashedPassword = 'hashedPassword'; // Replace with your expected hashed value

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      const result = await hashService.hashPassword(password);

      expect(result).toEqual(hashedPassword);
      expect(typeof hashedPassword).toBe('string');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, saltOrRounds);
    });
  });

  describe('comparePassword', () => {
    it('should compare a password and a hash', async () => {
      const password = 'password';
      const hash = 'hashedPassword'; // Replace with your expected hashed value

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await hashService.comparePassword(password, hash);

      expect(result).toEqual(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'password';
      const hash = 'hashedPassword'; // Replace with your expected hashed value

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await hashService.comparePassword(password, hash);

      expect(result).toEqual(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });
  });
});
