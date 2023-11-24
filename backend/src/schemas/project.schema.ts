import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
    @Prop({ unique: true, required: true, minlength: 3, maxlength: 50 })
    name: string;

    @Prop({ maxlength: 1500 })
    description: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;

    @Prop({ unique: true })
    slug: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project)