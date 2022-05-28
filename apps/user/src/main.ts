import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const port = process.env.USER_API_PORT || 8001;
  const app = await NestFactory.create(UserModule);

  const config = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription('Usage of User Api')
    .setVersion('1.0')
    .addTag('Users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('user/swagger/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port, () => {
    Logger.log(`User Api is running on port ${port}`);
  });
}
bootstrap();
