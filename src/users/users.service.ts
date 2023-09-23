import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserNotFoundException } from '@common/user-not-found.exception';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}
  
  async create(createUserInput: CreateUserInput) {
    const { 
      email, 
      password,
      avatar,
      username,
      phoneNumber
   } = createUserInput;
    const newUser = new User(email, username, password, avatar, phoneNumber);

    console.log("new user", newUser);
    const savedUser = await this.usersRepository.save(newUser);
    console.log("saved user", savedUser);

    return savedUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: {
      }
    });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      relations: {
      }
    });
  }

  findOneByPhoneNumber(phoneNumber: string) {
    return this.usersRepository.findOne({
      where: { phoneNumber },
    });
  }

  async getByPayload ({ sub }: JwtPayload) {
    return await this.findOne(sub);
  }

  update(user: User, updateUserInput: UpdateUserInput) {
    const updatedUser: Partial<User> = { ...updateUserInput, id: user.id };

    return this.usersRepository.save(updatedUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
