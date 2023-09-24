import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User), // Replace with the actual repository token
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = {
        email: 'test@blanche.com',
        password: 'password',
        avatar: 'avatar-url',
        username: 'test blanche',
        phoneNumber: '1230067890',
        confirmPassword: 'password', // Add confirmPassword to match your DTO
      };

      const newUser = new User(
        createUserInput.email,
        createUserInput.username,
        createUserInput.password,
        createUserInput.avatar,
        createUserInput.phoneNumber
      );

      // Mock the save method of the repository
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(newUser);

      const result = await usersService.create(createUserInput);

      expect(result).toEqual(newUser);
      expect(saveSpy).toHaveBeenCalledWith(newUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = 'some-user-id';
      const user = new User('test@blanche.com', 'test blanche', 'password', 'avatar-url', '1230067890');
      user.id = userId;

      // Mock the findOne method of the repository
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(user);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: userId } });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 'some-user-id';
      const updateUserInput: UpdateUserInput = {
        username: 'updated-username',
        id: ''
      };

      const user = new User('test@blanche.com', 'test blanche', 'password', 'avatar-url', '1230067890');
      user.id = userId;

      // Mock the findOne and save methods of the repository
      const findOneSpy = jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await usersService.update(user, updateUserInput);

      expect(result).toEqual(user);
      expect(saveSpy).toHaveBeenCalledWith({ ...updateUserInput, id: user.id });
    });
  });
});
