import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
    @Prop({ unique: true, required: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ default: '', maxlength: 1500 })
    description: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ default: '' })
    cover: string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)