import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
    @Prop({ unique: true, required: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ maxlength: 1500 })
    description: string;

    @Prop({ unique: true })
    slug: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true, default: false })
    isPrivate: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project)