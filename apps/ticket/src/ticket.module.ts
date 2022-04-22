import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    HttpModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, JwtStrategy],
})
export class AppModule {}
