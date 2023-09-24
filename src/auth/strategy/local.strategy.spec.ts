import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@users/entities/user.entity';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    const authServiceMock = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should call authService.validateUser with provided phoneNumber and password', async () => {
      const phoneNumber = '1234567890';
      const password = 'password';

      const validateUserSpy = jest.spyOn(localStrategy.authService, 'validateUser');

      await localStrategy.validate(phoneNumber, password);

      expect(validateUserSpy).toHaveBeenCalledWith(phoneNumber, password);
    });

    it('should return the user returned by authService.validateUser', async () => {
      const phoneNumber = '1234567890';
      const password = 'password';
      const mockUser: User = {
          id: '1', phoneNumber, password,
          username: '',
          balance: 0,
          email: '',
          transactions: [],
          createdAt: undefined,
          updatedAt: undefined
      };

      jest.spyOn(localStrategy.authService, 'validateUser').mockResolvedValue(mockUser);

      const result = await localStrategy.validate(phoneNumber, password);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if authService.validateUser returns an error', async () => {
      const phoneNumber = '1234567890';
      const password = 'password';

      jest.spyOn(localStrategy.authService, 'validateUser').mockRejectedValue(new UnauthorizedException());

      try {
        await localStrategy.validate(phoneNumber, password);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
