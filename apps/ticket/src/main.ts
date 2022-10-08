import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './ticket.module';

async function bootstrap() {
  const port = process.env.TICKET_API_PORT || 8000;
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('Ticket Api')
    .setDescription('Ticket Api Example')
    .setVersion('1.0')
    .addTag('Ticket')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('ticket/swagger/docs', app, document);

  const configService = app.get(ConfigService);

  const config = configService['internalConfig'].ticketApiConfig;

  console.log(configService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(config.port, () => {
    Logger.log(`Ticket Api is running on port ${config.port}`);
  });
}
bootstrap();
