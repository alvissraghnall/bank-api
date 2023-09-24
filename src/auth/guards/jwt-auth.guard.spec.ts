import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtKeyService } from '@jwt/jwt-key.service';
import { DataSource, Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from '@common/public.decorator';
import { User } from '@users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
}

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let jwtService: JwtService;
  let jwtKeyService: JwtKeyService;
  let datasource: DataSource;
  let userRepository: Repository<User>;

  const datasourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
    getRepository: jest.fn().mockReturnValue(userRepository),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User), // Provide the User repository token
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          }
        },
        {
          provide: JwtKeyService,
          useValue: {
            getPubKey: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useFactory: datasourceMockFactory,
        },
      ],
    }).compile(); 

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
    jwtService = module.get<JwtService>(JwtService);
    jwtKeyService = module.get<JwtKeyService>(JwtKeyService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User)); // Get the User repository
    datasource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for public route', async () => {
      const context = createExecutionContext();
      const isPublic = true;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);

      const result = await guard.canActivate(context);

      expect(result).toEqual(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true for authenticated user with valid token', async () => {
      const context = createExecutionContext();
      const isPublic = false;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
      jest.spyOn(jwtKeyService, 'getPubKey').mockResolvedValue(Buffer.from('publicKey'));
      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'userId' });
      // jest.spyOn(datasource, '').mockReturnValue({ sub: 'userId' });

      const result = await guard.canActivate(context);

      expect(result).toEqual(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(jwtKeyService.getPubKey).toHaveBeenCalled();
      expect(jwtService.verify).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const context = createExecutionContext();
      const isPublic = false;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
      jest.spyOn(jwtKeyService, 'getPubKey').mockResolvedValue(Buffer.from('publicKey'));
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const context = createExecutionContext();
      const isPublic = false;
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
      jest.spyOn(jwtKeyService, 'getPubKey').mockResolvedValue(Buffer.from('publicKey'));
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('JsonWebTokenError');
      });

      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});

function createExecutionContext() {
  const context: ExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: 'Bearer validToken',
        },
      }),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: () => [{}, {}, { req: { headers: { authorization: 'Bearer validToken' }, key: 'value',  } }, {}],
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: () => 'graphql',
    getRequest: (ctx: any) => ({
      headers: {
        Authorization: 'Bearer validToken',
      },
    }),
  } as any;
  return context;
}

