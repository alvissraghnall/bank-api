import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return the result of appService.getHello', () => {
      const mockHelloMessage = 'Hello, NestJS!';
      jest.spyOn(appService, 'getHello').mockReturnValue(mockHelloMessage);

      const result = appController.getHello();

      expect(result).toBe(mockHelloMessage);
    });
  });
});
