import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersResolver, UsersService],
    }).compile();

    usersResolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      ), new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033013'
      )];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);

      const result = await usersResolver.findAll();

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toBe(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const mockUser = new User(
        'jane@doe.com', 'jane doe', 'janedoe3003', '', '9033033033'
      );
      const username = 'testuser';
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);

      const result = await usersResolver.findOne(username);

      expect(usersService.findOneByUsername).toHaveBeenCalledWith(username);
      expect(result).toBe(mockUser);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      try {
        await usersResolver.findOne(username);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with Username: ${username} does not exist!`);
      }
    });
  });

  // Add tests for other resolver methods like findOneById, updateUser, removeUser...
});
