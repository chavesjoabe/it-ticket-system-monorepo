import { HttpModule } from '@nestjs/axios';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ticketApiConfig } from './config/ticket.config';
import {JwtMiddleware} from './middlewares/jwt.middleware';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [ticketApiConfig],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    HttpModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, JwtStrategy, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*');
  }
}
