import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto'

export type TicketDocument = Ticket & Document;

@Schema()
class Comment {
  @Prop({default: randomUUID() })
  id: string;
  @Prop()
  loggedUserName: string;
  @Prop()
  subject: string;
  @Prop()
  comment: string;
}

@Schema()
export class Ticket {
  @Prop({ default: `${Date.now()}` })
  id: string;
  @Prop()
  description: string;
  @Prop()
  type: string;
  @Prop()
  status: string;
  @Prop()
  title: string;
  @Prop()
  deviceId: string;
  @Prop()
  situation: string;
  @Prop()
  comments: Comment[];
  @Prop()
  attendantId: string;
  @Prop()
  userId: string;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
