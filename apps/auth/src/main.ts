import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const port = process.env.AUTH_API_PORT || 9000;
  const app = await NestFactory.create(AuthModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('Auth Api')
    .setDescription('Auth Api Example')
    .setVersion('1.0')
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('auth/swagger/docs', app, document);

  const configService = app.get(ConfigService);
  const config = configService['internalConfig'].authApiConfig;

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(config.port, () => {
    Logger.log(`Auth Api is running on port ${config.port}`);
  });
}
bootstrap();
