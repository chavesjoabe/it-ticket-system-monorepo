import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';

async function bootstrap() {
  const port = process.env.USER_API_PORT || 8001;
  const app = await NestFactory.create(UserModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log(`User Api is running on port ${port}`);
  });
}
bootstrap();
