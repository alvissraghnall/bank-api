import { ConflictException, UnauthorizedException, BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashService } from './hash/hash.service';
import { JwtService } from "@nestjs/jwt";
import { User } from '../users/entities/user.entity';
import { JwtKeyService } from './jwt/jwt-key.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { JwtPayload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {

  private readonly USER_NOT_FOUND = "USER_NOT_FOUND";
  private readonly PASSWORD_MISMATCH = "PASSWORD_MISMATCH";

  async login(user: User) {
    console.log(user);
    return {
      access_token: this.jwtService.sign({
        user: user.phoneNumber,
        sub: user.id
      }, {
        algorithm: "RS256",
        privateKey: await this.jwtKeyService.getPrivKey(),
      }),
      user
    }
  }
  
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly jwtKeyService: JwtKeyService,
  ) {}

  async validator () {
    //
  }

  async validateUser(phoneNumber: string, password: string): Promise<User | string> {    
    const user = await this.usersService.findOneByPhoneNumber(phoneNumber);
    console.log(user);
    
    if (!user) {
      throw new BadRequestException("User with Account Number: " + phoneNumber + " does not exist!");
    }

    if (!await this.hashService.comparePassword(password, user.password)) {
      throw new UnauthorizedException("Password incorrect!");
    }
    return user;
  }

  async create (createUserInput: CreateUserInput) {
    const existingUser = await this.usersService.findOneByUsername(createUserInput.username);

    if(existingUser) throw new ConflictException("User already exists!");

    return this.usersService.create(createUserInput);
  }

  async validateUserByPayload (userPayload: JwtPayload) {
    
    return await this.usersService.getByPayload(userPayload);
  }

}
