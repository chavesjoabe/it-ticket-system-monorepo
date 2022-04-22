import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket {
  @Prop()
  description: string;
  @Prop()
  type: string;
  @Prop()
  status: string;
  @Prop()
  attendatIt: string;
  @Prop()
  userId: string;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
