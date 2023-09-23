import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: '*',
  //   credentials: true 
  // });
  // app.setGlobalPrefix("/api/v1");
  app.useGlobalPipes(new ValidationPipe({
    forbidUnknownValues: false
  }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
  
  console.log(await app.getUrl());

}

bootstrap();
