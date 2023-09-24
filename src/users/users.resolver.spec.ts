import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: UsersService, // Mock the UsersService
          useValue: {
            findAll: jest.fn(),
            findOneByUsername: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User), 
          useClass: Repository,
        }
      ],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [{ id: '1', username: 'user1', phoneNumber: '27382708', balance: 20, password: 'blackjesus', transactions: [], email: 'black@jesus.dev', createdAt: new Date(), updatedAt: new Date() }, { id: '2', username: 'user2', phoneNumber: '27382708', balance: 20, password: 'blackjesus', transactions: [], email: 'black@jesus.dev', createdAt: new Date(), updatedAt: new Date() }];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);

      const result: User[] = await usersResolver.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const mockUser: User = {
        id: '1', username: 'testuser',
        phoneNumber: '',
        balance: 0,
        email: '',
        password: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };
      const username = 'testuser';
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result: User = await usersResolver.findOne(username);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      expect(usersResolver.findOne(username)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return a user by ID', async () => {
      const mockUser: User = {
        id: '1', username: 'testuser',
        phoneNumber: '',
        balance: 0,
        email: '',
        password: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };
      const userId = '1';
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      const result: User = await usersResolver.findOneById(userId);

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 'nonexistentid';
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      expect(usersResolver.findOneById(userId)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const mockUpdateUserInput: UpdateUserInput = {
        username: 'newusername',
        id: ''
      };
      const mockCurrentUser: User = {
        id: '1', username: 'testuser',
        phoneNumber: '',
        balance: 0,
        email: '',
        password: '',
        transactions: [],
        createdAt: undefined,
        updatedAt: undefined
      };
      const mockUpdatedUser: User = { ...mockCurrentUser, ...mockUpdateUserInput };
      jest.spyOn(usersService, 'update').mockResolvedValue(mockUpdatedUser);

      const result: User = await usersResolver.updateUser(mockUpdateUserInput, mockCurrentUser);

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('removeUser', () => {
    it('should remove a user by ID', async () => {
      const userId = 1;
      jest.spyOn(usersService, 'remove').mockReturnValue(true);

      const result: boolean = await usersResolver.removeUser(userId);

      expect(result).toBe(true);
    });
  });
});
