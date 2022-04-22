import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './ticket.module';

async function bootstrap() {
  const port = process.env.TICKET_API_PORT || 8000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log(`Ticket Api is running on port ${port}`);
  });
}
bootstrap();
