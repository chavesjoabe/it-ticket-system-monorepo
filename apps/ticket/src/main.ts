import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './ticket.module';

async function bootstrap() {
  const port = process.env.TICKET_API_PORT || 8000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ticket Api')
    .setDescription('Ticket Api Example')
    .setVersion('1.0')
    .addTag('Ticket')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('ticket/swagger/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port, () => {
    Logger.log(`Ticket Api is running on port ${port}`);
  });
}
bootstrap();
