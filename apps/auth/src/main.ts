import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const port = process.env.AUTH_API_PORT || 9000;
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log(`Auth Api is running on port ${port}`);
  });
}
bootstrap();
