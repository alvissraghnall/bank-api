import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { JwtKeyService } from './jwt/jwt-key.service';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserInput } from '../users/dto/create-user.input';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './jwt/jwt.payload';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let hashService: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        HashService,
        JwtService,
        JwtKeyService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const mockUser: User = {
          id: '1',
          phoneNumber: '1234567890',
          password: 'hashedPassword',
          email: 'stewstew@gmail.com',
          username: 'stew stew',
          balance: 0,
          transactions: [],
          createdAt: undefined,
          updatedAt: undefined
      };

      jest.spyOn(usersService, 'findOneByPhoneNumber').mockResolvedValue(mockUser);
      jest.spyOn(hashService, 'comparePassword').mockResolvedValue(true);

      const result = await authService.validateUser('1234567890', 'password');
      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const mockUser: User = {
          id: '1',
          phoneNumber: '1234567890',
          password: 'hashedPassword',
          email: 'stewstew@gmail.com',
          username: 'stew stew',
          balance: 0,
          transactions: [],
          createdAt: undefined,
          updatedAt: undefined
      };

      jest.spyOn(usersService, 'findOneByPhoneNumber').mockResolvedValue(mockUser);
      jest.spyOn(hashService, 'comparePassword').mockResolvedValue(false);

      try {
        await authService.validateUser('1234567890', 'incorrectPassword');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Password incorrect!');
      }
    });

    it('should throw BadRequestException for non-existent user', async () => {
      jest.spyOn(usersService, 'findOneByPhoneNumber').mockResolvedValue(null);

      try {
        await authService.validateUser('1234567890', 'password');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User with Account Number: 1234567890 does not exist!');
      }
    });
  });

  // Add more test cases for other methods such as create and login...
});
