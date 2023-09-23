import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { DataSource, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from '@transactions/entities/transaction.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  jest.setTimeout(15000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: "postgres",
          url: process.env.TEST_DB_URL,
          // synchronize: true,
          // dropSchema: true,
          // autoLoadEntities: true,
          entities: [User, Transaction],
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();
    
    dataSource = module.get<DataSource>(DataSource);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@kdot.com',
        username: 'kdot',
        password: 'password',
        avatar: 'avatar-url',
        phoneNumber: '1214567890',
        confirmPassword: ''
      };

      const newUser = new User(
        createUserInput.email,
        createUserInput.username,
        createUserInput.password,
        createUserInput.avatar,
        createUserInput.phoneNumber,
      );

      // userRepository.create.mockReturnValue(newUser);
      // userRepository.save(newUser);

      const savedUser = await usersService.create(createUserInput);

      expect(savedUser).toEqual(newUser);
      expect(userRepository.create).toHaveBeenCalledWith(newUser);
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('findOneByPhoneNumber', () => {
    it('should find a user by phone number', async () => {
      const phoneNumber = '1234560180';
      const user = new User(
        'test@r2bees.com',
        'r2bees',
        'password',
        'avatar-url',
        phoneNumber,
      );

      userRepository.save(user);

      // const repoFound = userRepository.findOne({ where: { phoneNumber } });

      // userRepository.findOneBy({ phoneNumber });

      const foundUser = await usersService.findOneByPhoneNumber(phoneNumber);

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(foundUser).toEqual(user);
      
    });

    it('should return null when user not found', async () => {
      const phoneNumber = 'nonexistent';

      // userRepository.findOne(null);

      const foundUser = await usersService.findOneByPhoneNumber(phoneNumber);

      expect(foundUser).toBeNull();
      
    });
  });
});
