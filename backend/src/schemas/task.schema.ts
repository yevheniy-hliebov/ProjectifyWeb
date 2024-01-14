import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
    @Prop({ type: Number, required: true, default: null })
    number: number;

    @Prop({ required: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ default: '', maxlength: 500 })
    description: string;

    @Prop({ default: '' })
    status: string;

    @Prop({ default: '' })
    priority: string;

    @Prop({ default: '' })
    start_date: string;

    @Prop({ default: '' })
    end_date: string;

    @Prop({ required: true })
    project_id: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ default: '' })
    cover: string
}

export const TaskSchema = SchemaFactory.createForClass(Task)