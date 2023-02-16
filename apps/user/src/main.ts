import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const port = process.env.USER_API_PORT || 8001;
  const app = await NestFactory.create(UserModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription('Usage of User Api')
    .setVersion('1.0')
    .addTag('Users')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('user/swagger/docs', app, document);

  const configService = app.get(ConfigService);

  const config = configService['internalConfig'].userApiConfig;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  await app.listen(config.port, () => {
    Logger.log(`User Api is running on config.port ${config.port}`);
  });
}
bootstrap();
