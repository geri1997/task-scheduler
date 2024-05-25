import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';
import { TaskStatus } from './enum/task-status.enum';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: string | User;

  @Prop({ default: TaskStatus.TO_DO })
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  assignedTo?: string | User;

  @Prop([String])
  attachments?: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
