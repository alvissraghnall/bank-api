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
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let hashService: HashService;
  let jwtService: JwtService;
  let jwtKeyService: JwtKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        HashService,
        JwtService,
        JwtKeyService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    hashService = module.get<HashService>(HashService);
    jwtService = module.get<JwtService>(JwtService);
    jwtKeyService = module.get<JwtKeyService>(JwtKeyService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
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

    it('should return an access token and user on successful login', async () => {
      const user: User = {
        id: '1',
        phoneNumber: '1234567890',
        password: 'hashed-password',
        username: '',
        balance: 0,
        email: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };

      const jwtPayload = {
        user: user.phoneNumber,
        sub: user.id,
      };

      const accessToken = 'access-token';

      // Mock the necessary service methods
      jest.spyOn(usersService, 'findOneByPhoneNumber').mockResolvedValue(user);
      jest.spyOn(hashService, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);
      jest.spyOn(jwtKeyService, 'getPrivKey').mockResolvedValue(Buffer.from('private-key'));

      const result = await authService.login(user);

      expect(result.access_token).toEqual(accessToken);
      expect(result.user).toEqual(user);
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

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@blanche.com',
        password: 'password',
        avatar: 'avatar-url',
        username: 'test blanche',
        phoneNumber: '1234567890',
        confirmPassword: 'password',
      };

      const newUser: User = {
        id: '1',
        ...createUserInput,
        balance: 0,
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };

      // Mock the necessary service methods
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(newUser);

      const result = await authService.create(createUserInput);

      expect(result).toEqual(newUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@blanche.com',
        password: 'password',
        avatar: 'avatar-url',
        username: 'test blanche',
        phoneNumber: '1234567890',
        confirmPassword: 'password',
      };

      // Mock the findOneByUsername method to return a user (already exists)
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue({} as User);

      try {
        await authService.create(createUserInput);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('User already exists!');
      }
    });
  });

  describe('validateUserByPayload', () => {
    it('should validate a user by payload', async () => {
      const jwtPayload: JwtPayload = {
        sub: '1',
        username: 'john doe',
      };

      const user: User = {
        id: jwtPayload.sub,
        phoneNumber: '1234567890',
        username: jwtPayload.username,
        balance: 0,
        email: '',
        password: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };

      // Mock the getByPayload method to return the user
      jest.spyOn(usersService, 'getByPayload').mockResolvedValue(user);

      const result = await authService.validateUserByPayload(jwtPayload);

      expect(result).toEqual(user);
    });
  });
});
