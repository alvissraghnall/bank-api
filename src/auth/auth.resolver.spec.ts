import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { User } from '../users/entities/user.entity';
import { LoginResponse } from './dto/login.response';
import { Public } from '@common/public.decorator';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '@common/current-user.decorator';
import { UsersService } from '@users/users.service';
import { UsersModule } from '@users/users.module';
import { HashService } from './hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { JwtKeyService } from './jwt/jwt-key.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthResolver', () => { 
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        AuthService, UsersService, HashService, JwtService, JwtKeyService,
        {
          provide: CurrentUser,
          useValue: (context: any) => context.req.user, // Mock the CurrentUser decorator
        }],
    }).compile();

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  describe('login', () => {
    it('should return a LoginResponse', async () => {
      const mockLoginInput: LoginUserInput = {
        phoneNumber: '1234567890',
        password: 'password',
      };

      const mockUser: User = {
        id: '1',
        phoneNumber: '1234567890',
        password: 'hashedPassword',
        username: '',
        balance: 0,
        email: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: 'mockAccessToken',
        user: mockUser,
      });

      const result: LoginResponse = await authResolver.login(mockLoginInput, { user: mockUser });

      expect(result.access_token).toBe('mockAccessToken');
      expect(result.user).toBe(mockUser);
    });

  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const mockCreateUserInput: CreateUserInput = {
        username: 'testuser',
        phoneNumber: '1234567890',
        password: 'password',
        email: '',
        confirmPassword: ''
      };

      const mockUser: User = {
        id: '1',
        phoneNumber: '1234567890',
        username: 'testuser',
        password: 'hashedPassword',
        balance: 0,
        email: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };

      jest.spyOn(authService, 'create').mockResolvedValue(mockUser);

      const result: User = await authResolver.signup(mockCreateUserInput);

      expect(result).toBe(mockUser);
    });

  });

  describe('checkJwt', () => {
    it('should return true', async () => {
      const result: boolean = await authResolver.checkJwt();
      expect(result).toBe(true);
    });
  });

  describe('whoami', () => {
    it('should return the current user', async () => {
      const mockUser: User = {
        id: '1',
        phoneNumber: '1234567890',
        password: 'hashedPassword',
        username: 'testuser',
        balance: 100,
        email: '',
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result: User = await authResolver.whoami(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
